/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `PersonalInfo` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `PersonalInfo` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `PersonalInfo` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `PersonalInfo` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `PersonalInfoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `PersonalInfoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `nameOfTheService` on the `Services` table. All the data in the column will be lost.
  - Added the required column `nameOfTheServiceid` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PersonalInfo_uniqueId_key";

-- AlterTable
ALTER TABLE "PersonalInfo" DROP COLUMN "avatarUrl",
DROP COLUMN "comments",
DROP COLUMN "isApproved",
DROP COLUMN "uniqueId";

-- AlterTable
ALTER TABLE "PersonalInfoHistory" DROP COLUMN "avatarUrl",
DROP COLUMN "comments";

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "approvedBy",
DROP COLUMN "nameOfTheService",
ADD COLUMN     "approverId" TEXT,
ADD COLUMN     "nameOfTheServiceid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ServiceAdd" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "targetDate" TIMESTAMP(3),
    "targetPrice" INTEGER,
    "minAmount" INTEGER,
    "maxCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceAdd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_nameOfTheServiceid_fkey" FOREIGN KEY ("nameOfTheServiceid") REFERENCES "ServiceAdd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
