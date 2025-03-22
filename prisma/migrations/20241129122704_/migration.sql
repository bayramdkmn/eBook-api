/*
  Warnings:

  - You are about to drop the `_Offered` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Offered" DROP CONSTRAINT "_Offered_A_fkey";

-- DropForeignKey
ALTER TABLE "_Offered" DROP CONSTRAINT "_Offered_B_fkey";

-- DropTable
DROP TABLE "_Offered";
