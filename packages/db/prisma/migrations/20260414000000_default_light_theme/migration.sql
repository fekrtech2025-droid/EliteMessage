-- Alter default theme preference for new users to light.
ALTER TABLE "User"
    ALTER COLUMN "themePreference" SET DEFAULT 'light';
