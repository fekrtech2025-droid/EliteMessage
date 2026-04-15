import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const totpStepSeconds = 30;
const totpDigits = 6;

function encodeBase32(buffer: Buffer) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += base32Alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += base32Alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

function decodeBase32(secret: string) {
  const normalized = secret.toUpperCase().replace(/=+$/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const character of normalized) {
    const index = base32Alphabet.indexOf(character);
    if (index === -1) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateTotpAt(secret: string, counter: number) {
  const secretBytes = decodeBase32(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac('sha1', secretBytes).update(buffer).digest();
  const offset = (digest.at(-1) ?? 0) & 0x0f;
  const binary =
    (((digest[offset] ?? 0) & 0x7f) << 24) |
    ((digest[offset + 1] ?? 0) << 16) |
    ((digest[offset + 2] ?? 0) << 8) |
    (digest[offset + 3] ?? 0);
  const token = binary % 10 ** totpDigits;

  return token.toString().padStart(totpDigits, '0');
}

export function createTotpSecret() {
  return encodeBase32(randomBytes(20));
}

export function generateTotpCode(secret: string, now = Date.now()) {
  const currentCounter = Math.floor(now / 1_000 / totpStepSeconds);
  return generateTotpAt(secret, currentCounter);
}

export function buildOtpauthUrl(
  issuer: string,
  accountLabel: string,
  secret: string,
) {
  const label = encodeURIComponent(`${issuer}:${accountLabel}`);
  return `otpauth://totp/${label}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${totpDigits}&period=${totpStepSeconds}`;
}

export function verifyTotp(
  secret: string,
  code: string,
  now = Date.now(),
  window = 1,
) {
  const normalized = code.trim();
  const currentCounter = Math.floor(now / 1_000 / totpStepSeconds);

  for (let offset = -window; offset <= window; offset += 1) {
    const expected = generateTotpAt(secret, currentCounter + offset);
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(normalized);

    if (
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return true;
    }
  }

  return false;
}
