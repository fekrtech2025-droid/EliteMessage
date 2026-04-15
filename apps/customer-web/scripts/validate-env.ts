import { loadWorkspaceEnv, parseCustomerWebEnv } from '@elite-message/config';

loadWorkspaceEnv();
parseCustomerWebEnv(process.env);
console.log('customer-web env validated');
