-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT[] DEFAULT ARRAY['user']::TEXT[],
    "referral" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalInfo" (
    "id" TEXT NOT NULL,
    "uniqueId" INTEGER NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "state" TEXT,
    "phoneNumber" TEXT,
    "country" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "pincode" TEXT,
    "city" TEXT,
    "avatarUrl" TEXT,
    "salutation" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isApproved" TEXT NOT NULL DEFAULT 'PENDING',
    "userid" TEXT NOT NULL,

    CONSTRAINT "PersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "nameOfTheService" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "paymentMode" TEXT,
    "transactionId" TEXT,
    "serviceDate" DATE,
    "posUserId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personalInfoId" TEXT NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceLimit" (
    "id" TEXT NOT NULL,
    "thirumanjanam" INTEGER NOT NULL DEFAULT 3,
    "abhisekam" INTEGER NOT NULL DEFAULT 3,
    "thirumanjanamPrice" INTEGER NOT NULL DEFAULT 1000,
    "abhisekamPrice" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "ServiceLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalInfoHistory" (
    "id" TEXT NOT NULL,
    "uniqueId" INTEGER NOT NULL,
    "email" TEXT,
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
    "salutation" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "personalInfoId" TEXT NOT NULL,

    CONSTRAINT "PersonalInfoHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "type" TEXT NOT NULL DEFAULT 'public',
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DislikedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_uniqueId_key" ON "PersonalInfo"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInfo_userid_key" ON "PersonalInfo"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedPosts_AB_unique" ON "_LikedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedPosts_B_index" ON "_LikedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DislikedPosts_AB_unique" ON "_DislikedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_DislikedPosts_B_index" ON "_DislikedPosts"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInfo" ADD CONSTRAINT "PersonalInfo_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_personalInfoId_fkey" FOREIGN KEY ("personalInfoId") REFERENCES "PersonalInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalInfoHistory" ADD CONSTRAINT "PersonalInfoHistory_personalInfoId_fkey" FOREIGN KEY ("personalInfoId") REFERENCES "PersonalInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DislikedPosts" ADD CONSTRAINT "_DislikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DislikedPosts" ADD CONSTRAINT "_DislikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
