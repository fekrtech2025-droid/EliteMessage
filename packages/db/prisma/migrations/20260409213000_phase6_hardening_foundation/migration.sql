ALTER TABLE "User"
    ADD COLUMN "adminMfaSecret" TEXT,
    ADD COLUMN "adminMfaPendingSecret" TEXT,
    ADD COLUMN "adminMfaEnabledAt" TIMESTAMP(3);

ALTER TABLE "Workspace"
    ADD COLUMN "trialEndsAt" TIMESTAMP(3);

UPDATE "Workspace"
SET "trialEndsAt" = "createdAt" + INTERVAL '14 days'
WHERE "trialEndsAt" IS NULL;

ALTER TABLE "InstanceSettings"
    ADD COLUMN "webhookSecret" TEXT;

UPDATE "InstanceSettings"
SET "webhookSecret" = encode(gen_random_bytes(32), 'hex')
WHERE "webhookSecret" IS NULL;

ALTER TABLE "InstanceSettings"
    ALTER COLUMN "webhookSecret" SET NOT NULL,
    ALTER COLUMN "webhookSecret" SET DEFAULT encode(gen_random_bytes(32), 'hex');
