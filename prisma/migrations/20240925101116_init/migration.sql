-- CreateTable
CREATE TABLE "PersonalInfoHistory" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "state" TEXT,
    "phoneNumber" TEXT,
    "country" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pincode" TEXT,
    "city" TEXT,
    "avatarUrl" TEXT,
    "oldRecord" JSONB,
    "salutation" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" TEXT DEFAULT 'null',

    CONSTRAINT "PersonalInfoHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfoHistory_email_key" ON "PersonalInfoHistory"("email");

-- AddForeignKey
ALTER TABLE "PersonalInfoHistory" ADD CONSTRAINT "PersonalInfoHistory_email_fkey" FOREIGN KEY ("email") REFERENCES "PersonalInfo"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
