import pino, { type Logger, type LoggerOptions } from 'pino';

export type LoggerContext = {
  service: string;
  correlationId?: string;
  requestId?: string;
  workerId?: string;
};

export type AppLogger = Logger;

export function createLogger(
  context: LoggerContext,
  options?: LoggerOptions,
): Logger {
  return pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: {
      service: context.service,
      correlationId: context.correlationId,
      requestId: context.requestId,
      workerId: context.workerId,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...options,
  });
}
