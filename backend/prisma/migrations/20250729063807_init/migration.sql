/*
  Warnings:

  - The `file` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `video` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "file",
ADD COLUMN     "file" TEXT[],
DROP COLUMN "video",
ADD COLUMN     "video" TEXT[];
