-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "meetLink" TEXT,
ADD COLUMN     "meetProvider" "MeetProvider",
ADD COLUMN     "defaultAmount" DOUBLE PRECISION;
