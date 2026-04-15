import {
  type WorkerHeartbeatPayload,
  WorkerHeartbeatPayloadSchema,
} from '@elite-message/contracts';

export function buildHeartbeatPayload(
  input: WorkerHeartbeatPayload,
): WorkerHeartbeatPayload {
  return WorkerHeartbeatPayloadSchema.parse(input);
}
