/*
  Warnings:

  - You are about to drop the column `uniqueId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueId]` on the table `PersonalInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_uniqueId_key";

-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "uniqueId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uniqueId";

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_uniqueId_key" ON "PersonalInfo"("uniqueId");
