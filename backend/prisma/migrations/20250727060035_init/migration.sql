-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('primary', 'secondary');

-- CreateTable
CREATE TABLE "ClassRoom" (
    "classRoomId" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "teacherId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassRoom_pkey" PRIMARY KEY ("classRoomId")
);

-- CreateTable
CREATE TABLE "Class" (
    "classId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "Course" (
    "courseId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacherId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "TeacherRole" NOT NULL DEFAULT 'primary',

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacherId")
);

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRoom" ADD CONSTRAINT "ClassRoom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("teacherId") ON DELETE SET NULL ON UPDATE CASCADE;
