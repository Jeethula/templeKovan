/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uniqueId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");
