-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isfirstTimeLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jwtToken" TEXT DEFAULT '',
ADD COLUMN     "refreshToken" TEXT DEFAULT '';
