-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('CLINICAL_PSYCHOLOGY', 'SOCIAL_INTEGRATION');

-- CreateEnum
CREATE TYPE "GoalArea" AS ENUM ('SOCIAL', 'LABOR', 'EDUCATIONAL', 'FAMILY');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ACHIEVED');

-- CreateEnum
CREATE TYPE "ProgressScale" AS ENUM ('INITIAL', 'IN_DEVELOPMENT', 'ACHIEVED');

-- CreateEnum
CREATE TYPE "ReportArea" AS ENUM ('SOCIAL_INTEGRATION', 'LABOR_INTEGRATION', 'EDUCATIONAL_INTEGRATION', 'FAMILY_INTEGRATION', 'AUTONOMY');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('MOTOR', 'COGNITIVE', 'SENSORY', 'MULTIPLE', 'OTHER');

-- AlterTable
ALTER TABLE "ClinicalProfile" ADD COLUMN     "autonomyLevel" TEXT,
ADD COLUMN     "disabilityType" "DisabilityType",
ADD COLUMN     "integrationContext" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "specialty" "Specialty" NOT NULL DEFAULT 'CLINICAL_PSYCHOLOGY';

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" "GoalArea" NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'PENDING',
    "targetDate" TIMESTAMP(3),
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "area" "ReportArea" NOT NULL,
    "progressScale" "ProgressScale" NOT NULL,
    "observations" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "nextObjectives" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Goal_patientId_idx" ON "Goal"("patientId");

-- CreateIndex
CREATE INDEX "Report_patientId_idx" ON "Report"("patientId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
