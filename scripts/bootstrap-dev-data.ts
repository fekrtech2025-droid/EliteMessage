import { loadWorkspaceEnv } from '@elite-message/config';
import { ensureBootstrapData, prisma } from '@elite-message/db';

async function main() {
  loadWorkspaceEnv();
  const summary = await ensureBootstrapData();

  console.log(`Bootstrapped development users for ${summary.workspaceName}.`);
  console.log(`Admin: ${summary.adminEmail}`);
  console.log(`Customer: ${summary.customerEmail}`);
}

void main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
