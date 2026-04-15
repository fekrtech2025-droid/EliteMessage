-- CreateEnum
CREATE TYPE "OutboundMessageType" AS ENUM ('chat', 'image');

-- CreateEnum
CREATE TYPE "MessageDeliveryStatus" AS ENUM ('queue', 'sent', 'unsent', 'invalid', 'expired');

-- CreateEnum
CREATE TYPE "MessageDeliveryAck" AS ENUM ('pending', 'server', 'device', 'read', 'played');

-- CreateEnum
CREATE TYPE "WebhookEventType" AS ENUM ('message_create', 'message_ack', 'message_received');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('pending', 'failed', 'delivered', 'exhausted');

-- CreateTable
CREATE TABLE "OutboundMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publicMessageId" TEXT NOT NULL,
    "instanceId" UUID NOT NULL,
    "messageType" "OutboundMessageType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "body" TEXT,
    "mediaUrl" TEXT,
    "caption" TEXT,
    "referenceId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "status" "MessageDeliveryStatus" NOT NULL DEFAULT 'queue',
    "ack" "MessageDeliveryAck" NOT NULL DEFAULT 'pending',
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processingWorkerId" TEXT,
    "processingStartedAt" TIMESTAMP(3),
    "workerId" TEXT,
    "providerMessageId" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdByActorType" "InstanceActorType" NOT NULL,
    "createdByActorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundMessageAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "messageId" UUID NOT NULL,
    "workerId" TEXT,
    "attemptNumber" INTEGER NOT NULL,
    "status" "MessageDeliveryStatus" NOT NULL,
    "ack" "MessageDeliveryAck",
    "message" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboundMessageAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instanceId" UUID NOT NULL,
    "messageId" UUID,
    "eventType" "WebhookEventType" NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'pending',
    "targetUrl" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "responseStatusCode" INTEGER,
    "responseBody" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutboundMessage_publicMessageId_key" ON "OutboundMessage"("publicMessageId");

-- CreateIndex
CREATE INDEX "OutboundMessage_instanceId_createdAt_idx" ON "OutboundMessage"("instanceId", "createdAt");

-- CreateIndex
CREATE INDEX "OutboundMessage_instanceId_status_scheduledFor_priority_idx" ON "OutboundMessage"("instanceId", "status", "scheduledFor", "priority");

-- CreateIndex
CREATE INDEX "OutboundMessage_referenceId_idx" ON "OutboundMessage"("referenceId");

-- CreateIndex
CREATE INDEX "OutboundMessage_recipient_idx" ON "OutboundMessage"("recipient");

-- CreateIndex
CREATE INDEX "OutboundMessageAttempt_messageId_createdAt_idx" ON "OutboundMessageAttempt"("messageId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OutboundMessageAttempt_messageId_attemptNumber_key" ON "OutboundMessageAttempt"("messageId", "attemptNumber");

-- CreateIndex
CREATE INDEX "WebhookDelivery_instanceId_createdAt_idx" ON "WebhookDelivery"("instanceId", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookDelivery_messageId_idx" ON "WebhookDelivery"("messageId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_nextAttemptAt_idx" ON "WebhookDelivery"("status", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundMessageAttempt" ADD CONSTRAINT "OutboundMessageAttempt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "OutboundMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "OutboundMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
