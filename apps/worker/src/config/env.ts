import { loadWorkspaceEnv, parseWorkerEnv } from '@elite-message/config';

export function loadWorkerEnv() {
  loadWorkspaceEnv();
  return parseWorkerEnv(process.env);
}
