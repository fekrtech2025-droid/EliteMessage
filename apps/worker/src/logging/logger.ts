import { createLogger, type AppLogger } from '@elite-message/config';

export function createWorkerLogger(workerId: string): AppLogger {
  return createLogger({
    service: 'worker',
    workerId,
  });
}
