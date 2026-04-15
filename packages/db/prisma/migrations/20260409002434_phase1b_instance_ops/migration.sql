-- CreateEnum
CREATE TYPE "InstanceLifecycleEventType" AS ENUM ('instance_created', 'token_rotated', 'worker_assigned', 'worker_released', 'status_changed');

-- CreateEnum
CREATE TYPE "InstanceActorType" AS ENUM ('customer_user', 'platform_admin', 'worker', 'system');

-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "lastLifecycleEventAt" TIMESTAMP(3),
ADD COLUMN     "substatus" TEXT;

-- CreateTable
CREATE TABLE "InstanceLifecycleEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instanceId" UUID NOT NULL,
    "eventType" "InstanceLifecycleEventType" NOT NULL,
    "actorType" "InstanceActorType" NOT NULL,
    "actorId" TEXT,
    "message" TEXT NOT NULL,
    "fromStatus" "InstanceLifecycleStatus",
    "toStatus" "InstanceLifecycleStatus",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstanceLifecycleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstanceLifecycleEvent_instanceId_createdAt_idx" ON "InstanceLifecycleEvent"("instanceId", "createdAt");

-- CreateIndex
CREATE INDEX "Instance_assignedWorkerId_idx" ON "Instance"("assignedWorkerId");

-- AddForeignKey
ALTER TABLE "InstanceLifecycleEvent" ADD CONSTRAINT "InstanceLifecycleEvent_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
