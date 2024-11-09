-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_posUserId_fkey" FOREIGN KEY ("posUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
