import { describe, expect, it } from 'vitest';
import { buildHeartbeatPayload } from '../src/worker/heartbeat';

describe('worker heartbeat payload', () => {
  it('builds a valid heartbeat payload', () => {
    const payload = buildHeartbeatPayload({
      workerId: 'worker-local-1',
      status: 'online',
      region: 'local',
      uptimeSeconds: 12,
      activeInstanceCount: 0,
      timestamp: new Date().toISOString(),
    });

    expect(payload.workerId).toBe('worker-local-1');
    expect(payload.status).toBe('online');
  });
});
