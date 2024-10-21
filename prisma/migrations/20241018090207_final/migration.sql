/*
  Warnings:

  - You are about to drop the column `Abhishekam` on the `ServiceLimit` table. All the data in the column will be lost.
  - You are about to drop the column `Thirumanjanam` on the `ServiceLimit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceLimit" DROP COLUMN "Abhishekam",
DROP COLUMN "Thirumanjanam",
ADD COLUMN     "abhisekam" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "thirumanjanam" INTEGER NOT NULL DEFAULT 3;
