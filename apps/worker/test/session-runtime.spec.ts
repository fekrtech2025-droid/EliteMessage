import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaceholderSessionRuntime } from '../src/runtime/session-runtime';

function createLogger() {
  return {
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
    debug: () => undefined,
    child: () => createLogger(),
  } as never;
}

describe('placeholder session runtime', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('keeps the QR published for the configured placeholder dwell time before auto-linking', async () => {
    vi.useFakeTimers();

    const updateInstanceStatus = vi.fn().mockResolvedValue(undefined);
    const updateInstanceRuntime = vi.fn().mockResolvedValue(undefined);
    const updateInstanceOperationStatus = vi.fn().mockResolvedValue(undefined);

    const runtime = new PlaceholderSessionRuntime({
      workerId: 'worker-test-1',
      logger: createLogger(),
      placeholderQrDisplayMs: 15_000,
      internalApi: {
        updateInstanceStatus,
        updateInstanceRuntime,
        updateInstanceOperationStatus,
      } as never,
    });

    runtime.syncAssignedInstances([
      {
        id: 'instance-1',
        publicId: 'inst_1',
        name: 'Instance 1',
        workspaceId: 'workspace-1',
        workspaceName: 'Workspace 1',
        status: 'standby',
        substatus: null,
        assignedWorker: {
          workerId: 'worker-test-1',
          status: 'online',
          region: 'local',
          uptimeSeconds: 10,
          activeInstanceCount: 1,
          lastSeenAt: new Date().toISOString(),
        },
        pendingOperation: {
          id: 'operation-1',
          action: 'start',
          status: 'pending',
          targetWorkerId: null,
          message: 'start requested.',
          errorMessage: null,
          requestedByActorType: 'customer_user',
          requestedByActorId: 'user-1',
          createdAt: new Date().toISOString(),
          startedAt: null,
          completedAt: null,
        },
      },
    ]);

    const processingPromise = runtime.processAssignments();
    await vi.advanceTimersByTimeAsync(1_200);

    expect(
      updateInstanceRuntime.mock.calls.some(
        ([, payload]) =>
          payload.qrCode &&
          payload.qrExpiresAt &&
          payload.currentSessionLabel === null,
      ),
    ).toBe(true);
    expect(
      updateInstanceRuntime.mock.calls.some(
        ([, payload]) =>
          payload.qrCode === null &&
          typeof payload.currentSessionLabel === 'string',
      ),
    ).toBe(false);

    await vi.advanceTimersByTimeAsync(15_000);
    await processingPromise;

    expect(
      updateInstanceRuntime.mock.calls.some(
        ([, payload]) =>
          payload.qrCode === null &&
          typeof payload.currentSessionLabel === 'string',
      ),
    ).toBe(true);
  });
});
