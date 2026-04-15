CREATE TYPE "AuditActorType" AS ENUM ('anonymous', 'customer_user', 'platform_admin', 'worker', 'system');

CREATE TYPE "AuditEntityType" AS ENUM (
  'auth_session',
  'user',
  'workspace',
  'account_api_token',
  'instance',
  'instance_settings',
  'instance_api_token',
  'instance_operation',
  'outbound_message',
  'inbound_message',
  'webhook_delivery',
  'worker'
);

CREATE TABLE "AuditLog" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "workspaceId" UUID,
  "instanceId" UUID,
  "actorType" "AuditActorType" NOT NULL,
  "actorId" TEXT,
  "entityType" "AuditEntityType" NOT NULL,
  "entityId" TEXT,
  "action" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_workspaceId_createdAt_idx" ON "AuditLog"("workspaceId", "createdAt");
CREATE INDEX "AuditLog_instanceId_createdAt_idx" ON "AuditLog"("instanceId", "createdAt");
CREATE INDEX "AuditLog_actorType_createdAt_idx" ON "AuditLog"("actorType", "createdAt");
CREATE INDEX "AuditLog_entityType_createdAt_idx" ON "AuditLog"("entityType", "createdAt");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_instanceId_fkey"
  FOREIGN KEY ("instanceId") REFERENCES "Instance"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
