/*
  Warnings:

  - You are about to drop the column `nameOfTheServiceid` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the column `personalInfoId` on the `Services` table. All the data in the column will be lost.
  - Added the required column `nameOfTheServiceId` to the `Services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_nameOfTheServiceid_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_personalInfoId_fkey";

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "nameOfTheServiceid",
DROP COLUMN "personalInfoId",
ADD COLUMN     "nameOfTheServiceId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_nameOfTheServiceId_fkey" FOREIGN KEY ("nameOfTheServiceId") REFERENCES "ServiceAdd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
