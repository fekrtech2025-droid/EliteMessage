"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTotpSecret = createTotpSecret;
exports.generateTotpCode = generateTotpCode;
exports.buildOtpauthUrl = buildOtpauthUrl;
exports.verifyTotp = verifyTotp;
const node_crypto_1 = require("node:crypto");
const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const totpStepSeconds = 30;
const totpDigits = 6;
function encodeBase32(buffer) {
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
function decodeBase32(secret) {
    const normalized = secret.toUpperCase().replace(/=+$/g, '');
    let bits = 0;
    let value = 0;
    const bytes = [];
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
function generateTotpAt(secret, counter) {
    const secretBytes = decodeBase32(secret);
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(counter));
    const digest = (0, node_crypto_1.createHmac)('sha1', secretBytes).update(buffer).digest();
    const offset = (digest.at(-1) ?? 0) & 0x0f;
    const binary = (((digest[offset] ?? 0) & 0x7f) << 24) |
        ((digest[offset + 1] ?? 0) << 16) |
        ((digest[offset + 2] ?? 0) << 8) |
        (digest[offset + 3] ?? 0);
    const token = binary % 10 ** totpDigits;
    return token.toString().padStart(totpDigits, '0');
}
function createTotpSecret() {
    return encodeBase32((0, node_crypto_1.randomBytes)(20));
}
function generateTotpCode(secret, now = Date.now()) {
    const currentCounter = Math.floor(now / 1_000 / totpStepSeconds);
    return generateTotpAt(secret, currentCounter);
}
function buildOtpauthUrl(issuer, accountLabel, secret) {
    const label = encodeURIComponent(`${issuer}:${accountLabel}`);
    return `otpauth://totp/${label}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${totpDigits}&period=${totpStepSeconds}`;
}
function verifyTotp(secret, code, now = Date.now(), window = 1) {
    const normalized = code.trim();
    const currentCounter = Math.floor(now / 1_000 / totpStepSeconds);
    for (let offset = -window; offset <= window; offset += 1) {
        const expected = generateTotpAt(secret, currentCounter + offset);
        const expectedBuffer = Buffer.from(expected);
        const receivedBuffer = Buffer.from(normalized);
        if (expectedBuffer.length === receivedBuffer.length &&
            (0, node_crypto_1.timingSafeEqual)(expectedBuffer, receivedBuffer)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=totp.js.map