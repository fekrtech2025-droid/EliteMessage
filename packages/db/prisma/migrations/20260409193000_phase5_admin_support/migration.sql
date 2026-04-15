ALTER TYPE "AuditEntityType" ADD VALUE IF NOT EXISTS 'support_case';

CREATE TYPE "SupportCaseStatus" AS ENUM ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed');

CREATE TYPE "SupportCasePriority" AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE "SupportCase" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publicId" TEXT NOT NULL,
    "workspaceId" UUID,
    "instanceId" UUID,
    "requesterUserId" UUID,
    "assignedAdminUserId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "SupportCasePriority" NOT NULL DEFAULT 'normal',
    "status" "SupportCaseStatus" NOT NULL DEFAULT 'open',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportCase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SupportCase_publicId_key" ON "SupportCase"("publicId");
CREATE INDEX "SupportCase_status_priority_createdAt_idx" ON "SupportCase"("status", "priority", "createdAt");
CREATE INDEX "SupportCase_workspaceId_createdAt_idx" ON "SupportCase"("workspaceId", "createdAt");
CREATE INDEX "SupportCase_instanceId_createdAt_idx" ON "SupportCase"("instanceId", "createdAt");
CREATE INDEX "SupportCase_assignedAdminUserId_status_createdAt_idx" ON "SupportCase"("assignedAdminUserId", "status", "createdAt");

ALTER TABLE "SupportCase"
    ADD CONSTRAINT "SupportCase_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportCase"
    ADD CONSTRAINT "SupportCase_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportCase"
    ADD CONSTRAINT "SupportCase_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportCase"
    ADD CONSTRAINT "SupportCase_assignedAdminUserId_fkey" FOREIGN KEY ("assignedAdminUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
