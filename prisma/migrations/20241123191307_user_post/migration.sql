-- CreateTable
CREATE TABLE "UserPosts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPosts_id_key" ON "UserPosts"("id");

-- AddForeignKey
ALTER TABLE "UserPosts" ADD CONSTRAINT "UserPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
