/*
  Warnings:

  - You are about to drop the column `email` on the `PersonalInfo` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueId]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userid]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueId` to the `PersonalInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `PersonalInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalInfoId` to the `PersonalInfoHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PersonalInfo" DROP CONSTRAINT "PersonalInfo_email_fkey";

-- DropForeignKey
ALTER TABLE "PersonalInfoHistory" DROP CONSTRAINT "PersonalInfoHistory_email_fkey";

-- DropIndex
DROP INDEX "PersonalInfo_email_key";

-- DropIndex
DROP INDEX "User_uniqueId_key";

-- AlterTable
ALTER TABLE "PersonalInfo" DROP COLUMN "email",
ADD COLUMN     "uniqueId" INTEGER NOT NULL,
ADD COLUMN     "userid" TEXT NOT NULL,
ALTER COLUMN "isApproved" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "PersonalInfoHistory" ADD COLUMN     "personalInfoId" TEXT NOT NULL,
ALTER COLUMN "isApproved" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uniqueId",
ADD COLUMN     "phone" INTEGER NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_uniqueId_key" ON "PersonalInfo"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_userid_key" ON "PersonalInfo"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInfoHistory" ADD CONSTRAINT "PersonalInfoHistory_personalInfoId_fkey" FOREIGN KEY ("personalInfoId") REFERENCES "PersonalInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
