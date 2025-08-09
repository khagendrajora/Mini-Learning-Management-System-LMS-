/*
  Warnings:

  - The values [primary,secondary] on the enum `TeacherRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updated` on the `Classroom` table. All the data in the column will be lost.
  - Added the required column `name` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TeacherRole_new" AS ENUM ('lead', 'assistance');
ALTER TABLE "Teacher" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Teacher" ALTER COLUMN "role" TYPE "TeacherRole_new" USING ("role"::text::"TeacherRole_new");
ALTER TYPE "TeacherRole" RENAME TO "TeacherRole_old";
ALTER TYPE "TeacherRole_new" RENAME TO "TeacherRole";
DROP TYPE "TeacherRole_old";
ALTER TABLE "Teacher" ALTER COLUMN "role" SET DEFAULT 'lead';
COMMIT;

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "updated",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "role" SET DEFAULT 'lead';

-- CreateTable
CREATE TABLE "_CourseToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToTeacher_B_index" ON "_CourseToTeacher"("B");

-- AddForeignKey
ALTER TABLE "_CourseToTeacher" ADD CONSTRAINT "_CourseToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToTeacher" ADD CONSTRAINT "_CourseToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("teacherId") ON DELETE CASCADE ON UPDATE CASCADE;
