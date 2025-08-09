/*
  Warnings:

  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - Added the required column `courseTitle` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "title",
ADD COLUMN     "courseTitle" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL;
