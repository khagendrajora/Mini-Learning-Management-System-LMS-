/*
  Warnings:

  - You are about to drop the `ClassRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassRoom" DROP CONSTRAINT "ClassRoom_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassRoom" DROP CONSTRAINT "ClassRoom_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ClassRoom" DROP CONSTRAINT "ClassRoom_teacherId_fkey";

-- DropTable
DROP TABLE "ClassRoom";

-- CreateTable
CREATE TABLE "Classroom" (
    "classRoomId" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "teacherId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("classRoomId")
);

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("teacherId") ON DELETE SET NULL ON UPDATE CASCADE;
