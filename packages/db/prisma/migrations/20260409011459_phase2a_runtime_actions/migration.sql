-- CreateEnum
CREATE TYPE "InstanceOperationType" AS ENUM ('start', 'stop', 'restart', 'logout', 'clear', 'reassign');

-- CreateEnum
CREATE TYPE "InstanceOperationStatus" AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InstanceLifecycleEventType" ADD VALUE 'settings_updated';
ALTER TYPE "InstanceLifecycleEventType" ADD VALUE 'action_requested';
ALTER TYPE "InstanceLifecycleEventType" ADD VALUE 'action_completed';
ALTER TYPE "InstanceLifecycleEventType" ADD VALUE 'action_failed';

-- CreateTable
CREATE TABLE "InstanceRuntimeState" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instanceId" UUID NOT NULL,
    "qrCode" TEXT,
    "qrExpiresAt" TIMESTAMP(3),
    "currentSessionLabel" TEXT,
    "lastStartedAt" TIMESTAMP(3),
    "lastAuthenticatedAt" TIMESTAMP(3),
    "lastDisconnectedAt" TIMESTAMP(3),
    "disconnectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstanceRuntimeState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceOperation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instanceId" UUID NOT NULL,
    "operationType" "InstanceOperationType" NOT NULL,
    "status" "InstanceOperationStatus" NOT NULL DEFAULT 'pending',
    "requestedByActorType" "InstanceActorType" NOT NULL,
    "requestedByActorId" TEXT,
    "targetWorkerId" TEXT,
    "message" TEXT,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstanceOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstanceRuntimeState_instanceId_key" ON "InstanceRuntimeState"("instanceId");

-- CreateIndex
CREATE INDEX "InstanceOperation_instanceId_createdAt_idx" ON "InstanceOperation"("instanceId", "createdAt");

-- CreateIndex
CREATE INDEX "InstanceOperation_instanceId_status_createdAt_idx" ON "InstanceOperation"("instanceId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "InstanceRuntimeState" ADD CONSTRAINT "InstanceRuntimeState_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceOperation" ADD CONSTRAINT "InstanceOperation_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
