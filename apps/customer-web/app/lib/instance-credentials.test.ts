import { afterEach, describe, expect, it } from 'vitest';
import {
  clearStoredInstanceCredentials,
  listStoredInstanceCredentials,
  readInstanceCredentials,
  storeInstanceCredentials,
} from './instance-credentials';

afterEach(() => {
  clearStoredInstanceCredentials();
});

describe('instance credential storage', () => {
  it('stores, lists, reads, and clears instance credentials', () => {
    storeInstanceCredentials({
      instanceId: 'instance-1',
      publicId: 'inst_alpha',
      instanceName: 'Alpha',
      token: 'instance_token_alpha',
      updatedAt: '2026-04-11T10:00:00.000Z',
      source: 'created',
    });
    storeInstanceCredentials({
      instanceId: 'instance-2',
      publicId: 'inst_beta',
      instanceName: 'Beta',
      token: 'instance_token_beta',
      updatedAt: '2026-04-11T10:05:00.000Z',
      source: 'rotated',
    });

    expect(readInstanceCredentials('instance-1')?.publicId).toBe('inst_alpha');
    expect(
      listStoredInstanceCredentials().map((item) => item.instanceId),
    ).toEqual(['instance-2', 'instance-1']);

    clearStoredInstanceCredentials('instance-2');
    expect(readInstanceCredentials('instance-2')).toBeNull();

    clearStoredInstanceCredentials();
    expect(listStoredInstanceCredentials()).toEqual([]);
  });
});
