import { loadWorkspaceEnv, parseAdminWebEnv } from '@elite-message/config';

loadWorkspaceEnv();
parseAdminWebEnv(process.env);
console.log('admin-web env validated');
