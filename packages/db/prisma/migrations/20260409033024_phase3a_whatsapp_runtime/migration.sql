-- CreateEnum
CREATE TYPE "SessionBackend" AS ENUM ('placeholder', 'whatsapp_web');

-- CreateEnum
CREATE TYPE "InboundMessageKind" AS ENUM ('chat', 'image', 'document', 'audio', 'video', 'sticker', 'unknown');

-- AlterTable
ALTER TABLE "InstanceRuntimeState" ADD COLUMN     "lastInboundMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastScreenshotAt" TIMESTAMP(3),
ADD COLUMN     "lastScreenshotPath" TEXT,
ADD COLUMN     "sessionBackend" "SessionBackend" NOT NULL DEFAULT 'placeholder',
ADD COLUMN     "sessionDiagnostics" JSONB;

-- CreateTable
CREATE TABLE "InboundMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "publicMessageId" TEXT NOT NULL,
    "instanceId" UUID NOT NULL,
    "providerMessageId" TEXT,
    "chatId" TEXT,
    "sender" TEXT NOT NULL,
    "pushName" TEXT,
    "kind" "InboundMessageKind" NOT NULL DEFAULT 'chat',
    "body" TEXT,
    "mediaUrl" TEXT,
    "mimeType" TEXT,
    "fromMe" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InboundMessage_publicMessageId_key" ON "InboundMessage"("publicMessageId");

-- CreateIndex
CREATE INDEX "InboundMessage_instanceId_receivedAt_idx" ON "InboundMessage"("instanceId", "receivedAt");

-- CreateIndex
CREATE INDEX "InboundMessage_providerMessageId_idx" ON "InboundMessage"("providerMessageId");

-- CreateIndex
CREATE INDEX "InboundMessage_sender_idx" ON "InboundMessage"("sender");

-- AddForeignKey
ALTER TABLE "InboundMessage" ADD CONSTRAINT "InboundMessage_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
