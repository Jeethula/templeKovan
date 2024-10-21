/*
  Warnings:

  - The `isApproved` column on the `PersonalInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Services` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PersonalInfo" DROP COLUMN "isApproved",
ADD COLUMN     "isApproved" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "Status";
