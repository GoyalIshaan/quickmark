/*
  Warnings:

  - You are about to drop the `_Follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Follows" DROP CONSTRAINT "_Follows_A_fkey";

-- DropForeignKey
ALTER TABLE "_Follows" DROP CONSTRAINT "_Follows_B_fkey";

-- DropTable
DROP TABLE "_Follows";

-- CreateTable
CREATE TABLE "Following" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
