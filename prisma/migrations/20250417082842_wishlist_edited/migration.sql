/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `ReadBook` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,bookId]` on the table `WishList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReadBook_userId_bookId_key" ON "ReadBook"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "WishList_userId_bookId_key" ON "WishList"("userId", "bookId");
