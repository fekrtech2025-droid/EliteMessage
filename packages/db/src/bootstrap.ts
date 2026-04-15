import { MembershipRole, UserRole } from '@prisma/client';
import { loadWorkspaceEnv } from '@elite-message/config';
import { prisma } from './index';
import { hashPassword, normalizeEmail } from './security';

export type BootstrapSummary = {
  adminEmail: string;
  customerEmail: string;
  workspaceName: string;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export async function ensureBootstrapData(): Promise<BootstrapSummary> {
  loadWorkspaceEnv();

  const adminEmail = normalizeEmail(
    process.env.DEV_BOOTSTRAP_ADMIN_EMAIL ?? 'admin@elite.local',
  );
  const customerEmail = normalizeEmail(
    process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL ?? 'owner@elite.local',
  );
  const workspaceName =
    process.env.DEV_BOOTSTRAP_WORKSPACE_NAME ?? 'Acme Workspace';
  const workspaceSlug = slugify(workspaceName) || 'acme-workspace';

  const [adminPasswordHash, customerPasswordHash] = await Promise.all([
    hashPassword(process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD ?? 'Admin123456!'),
    hashPassword(
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD ?? 'Customer123456!',
    ),
  ]);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      displayName: process.env.DEV_BOOTSTRAP_ADMIN_NAME ?? 'Elite Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.platform_admin,
      status: 'active',
    },
    create: {
      email: adminEmail,
      displayName: process.env.DEV_BOOTSTRAP_ADMIN_NAME ?? 'Elite Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.platform_admin,
      status: 'active',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      displayName: process.env.DEV_BOOTSTRAP_CUSTOMER_NAME ?? 'Workspace Owner',
      passwordHash: customerPasswordHash,
      role: UserRole.customer,
      status: 'active',
    },
    create: {
      email: customerEmail,
      displayName: process.env.DEV_BOOTSTRAP_CUSTOMER_NAME ?? 'Workspace Owner',
      passwordHash: customerPasswordHash,
      role: UserRole.customer,
      status: 'active',
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: workspaceSlug },
    update: { name: workspaceName, status: 'active' },
    create: {
      name: workspaceName,
      slug: workspaceSlug,
      status: 'active',
    },
  });

  await prisma.membership.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: customerUser.id,
      },
    },
    update: { role: MembershipRole.owner },
    create: {
      workspaceId: workspace.id,
      userId: customerUser.id,
      role: MembershipRole.owner,
    },
  });

  return {
    adminEmail: adminUser.email,
    customerEmail: customerUser.email,
    workspaceName: workspace.name,
  };
}
