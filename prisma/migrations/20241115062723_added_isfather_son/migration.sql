/*
  Warnings:

  - A unique constraint covering the columns `[fatherId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[motherId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PersonalInfo" ADD COLUMN     "Son" TEXT[],
ADD COLUMN     "daughter" TEXT[],
ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fatherId" TEXT,
ADD COLUMN     "motherId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_fatherId_key" ON "User"("fatherId");

-- CreateIndex
CREATE UNIQUE INDEX "User_motherId_key" ON "User"("motherId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
