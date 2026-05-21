-- Migration: replace screenshotUrl/videoUrl with attachmentUrls array
-- Data is preserved by copying existing values into the array before dropping columns

ALTER TABLE "Feedback" ADD COLUMN "attachmentUrls" TEXT[] NOT NULL DEFAULT '{}';

UPDATE "Feedback" SET "attachmentUrls" = ARRAY["screenshotUrl"] WHERE "screenshotUrl" IS NOT NULL;

UPDATE "Feedback" SET "attachmentUrls" = array_append("attachmentUrls", "videoUrl") WHERE "videoUrl" IS NOT NULL;

ALTER TABLE "Feedback" DROP COLUMN "screenshotUrl";

ALTER TABLE "Feedback" DROP COLUMN "videoUrl";
