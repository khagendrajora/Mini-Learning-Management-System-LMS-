/*
  Warnings:

  - You are about to drop the column `video` on the `Module` table. All the data in the column will be lost.
  - Added the required column `url` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Module" DROP COLUMN "video",
ADD COLUMN     "url" TEXT NOT NULL;
