-- CreateTable
CREATE TABLE "ServiceLimit" (
    "id" TEXT NOT NULL,
    "Thirumanjanam" INTEGER NOT NULL DEFAULT 3,
    "Abhishekam" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "ServiceLimit_pkey" PRIMARY KEY ("id")
);
