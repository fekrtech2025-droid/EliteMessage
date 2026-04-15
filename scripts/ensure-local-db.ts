import { ensureLocalDatabase, loadLocalEnv } from './local-dev';

async function main() {
  const env = loadLocalEnv();
  await ensureLocalDatabase(env);
  console.log(`Database bootstrap complete for ${env.POSTGRES_DB}.`);
}

void main();
