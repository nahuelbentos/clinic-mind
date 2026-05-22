-- Idempotent migration: safe to run even after a partial previous attempt

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Feedback' AND column_name = 'attachmentUrls'
  ) THEN
    ALTER TABLE "Feedback" ADD COLUMN "attachmentUrls" TEXT[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Feedback' AND column_name = 'screenshotUrl'
  ) THEN
    UPDATE "Feedback"
      SET "attachmentUrls" = ARRAY["screenshotUrl"]
      WHERE "screenshotUrl" IS NOT NULL;
    ALTER TABLE "Feedback" DROP COLUMN "screenshotUrl";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Feedback' AND column_name = 'videoUrl'
  ) THEN
    UPDATE "Feedback"
      SET "attachmentUrls" = array_append("attachmentUrls", "videoUrl")
      WHERE "videoUrl" IS NOT NULL;
    ALTER TABLE "Feedback" DROP COLUMN "videoUrl";
  END IF;
END $$;
