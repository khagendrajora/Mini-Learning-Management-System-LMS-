/*
  Warnings:

  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - Added the required column `accessPeriod` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introVideo` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaDescription` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "name",
ADD COLUMN     "accessPeriod" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "introVideo" TEXT NOT NULL,
ADD COLUMN     "liveClassTime" TIMESTAMP(3),
ADD COLUMN     "metaDescription" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Module" (
    "moduleId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("moduleId")
);

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
