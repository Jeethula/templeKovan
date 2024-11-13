-- CreateTable
CREATE TABLE "NallaNeram" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "muhurat" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NallaNeram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NallaNeram_date_key" ON "NallaNeram"("date");
