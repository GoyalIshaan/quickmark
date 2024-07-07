-- CreateTable
CREATE TABLE "_Follows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Likes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Saved" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Follows_AB_unique" ON "_Follows"("A", "B");

-- CreateIndex
CREATE INDEX "_Follows_B_index" ON "_Follows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Likes_AB_unique" ON "_Likes"("A", "B");

-- CreateIndex
CREATE INDEX "_Likes_B_index" ON "_Likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Saved_AB_unique" ON "_Saved"("A", "B");

-- CreateIndex
CREATE INDEX "_Saved_B_index" ON "_Saved"("B");

-- AddForeignKey
ALTER TABLE "_Follows" ADD CONSTRAINT "_Follows_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Follows" ADD CONSTRAINT "_Follows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Saved" ADD CONSTRAINT "_Saved_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Saved" ADD CONSTRAINT "_Saved_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
