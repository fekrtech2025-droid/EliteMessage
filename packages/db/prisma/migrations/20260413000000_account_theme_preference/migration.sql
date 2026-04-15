-- CreateEnum
CREATE TYPE "ThemePreference" AS ENUM ('system', 'light', 'dark');

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "themePreference" "ThemePreference" NOT NULL DEFAULT 'system';
