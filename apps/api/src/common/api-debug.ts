import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';

type DebugDetails = Record<string, unknown>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeValue(entry)]),
    );
  }

  return value;
}

export function isApiDebugEnabled() {
  return process.env.API_DEBUG_MODE === 'true';
}

export function resolveApiDebugLogPath() {
  const configured = process.env.API_DEBUG_LOG_FILE?.trim();
  if (!configured) {
    return resolve(process.cwd(), 'api-debug.log');
  }

  return isAbsolute(configured) ? configured : resolve(process.cwd(), configured);
}

export function writeApiDebugLog(event: string, details: DebugDetails = {}) {
  if (!isApiDebugEnabled()) {
    return;
  }

  try {
    const logPath = resolveApiDebugLogPath();
    mkdirSync(dirname(logPath), { recursive: true });
    const normalizedDetails = normalizeValue(details);
    appendFileSync(
      logPath,
      `${JSON.stringify({
        time: new Date().toISOString(),
        event,
        pid: process.pid,
        cwd: process.cwd(),
        details: isPlainObject(normalizedDetails) ? normalizedDetails : {},
      })}\n`,
      'utf8',
    );
  } catch {
    // Never let debug logging break the app bootstrap path.
  }
}
