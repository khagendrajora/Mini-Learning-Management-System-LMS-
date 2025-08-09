/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Classroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_classId_fkey";

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacherId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "teacherId",
ALTER COLUMN "classId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ClassroomToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassroomToTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClassroomToTeacher_B_index" ON "_ClassroomToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToTeacher" ADD CONSTRAINT "_ClassroomToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("classRoomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToTeacher" ADD CONSTRAINT "_ClassroomToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("teacherId") ON DELETE CASCADE ON UPDATE CASCADE;
