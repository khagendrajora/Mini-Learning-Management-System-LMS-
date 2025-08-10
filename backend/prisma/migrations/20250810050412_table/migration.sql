/*
  Warnings:

  - You are about to drop the column `accessPeriod` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseTitle` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `introVideo` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `liveClassTime` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassroomToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Classroom" DROP CONSTRAINT "Classroom_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Classroom" DROP CONSTRAINT "Classroom_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Module" DROP CONSTRAINT "Module_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClassroomToTeacher" DROP CONSTRAINT "_ClassroomToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClassroomToTeacher" DROP CONSTRAINT "_ClassroomToTeacher_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CourseToTeacher" DROP CONSTRAINT "_CourseToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CourseToTeacher" DROP CONSTRAINT "_CourseToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "accessPeriod",
DROP COLUMN "category",
DROP COLUMN "courseTitle",
DROP COLUMN "duration",
DROP COLUMN "introVideo",
DROP COLUMN "liveClassTime",
DROP COLUMN "metaDescription",
DROP COLUMN "path",
DROP COLUMN "price",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Admin";

-- DropTable
DROP TABLE "public"."Class";

-- DropTable
DROP TABLE "public"."Classroom";

-- DropTable
DROP TABLE "public"."Module";

-- DropTable
DROP TABLE "public"."Teacher";

-- DropTable
DROP TABLE "public"."_ClassroomToTeacher";

-- DropTable
DROP TABLE "public"."_CourseToTeacher";

-- DropEnum
DROP TYPE "public"."AdminRole";

-- DropEnum
DROP TYPE "public"."TeacherRole";

-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "videoId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "duration" INTEGER,
    "courseId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "public"."CourseProgress" (
    "progressId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "progress" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("progressId")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "commentId" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "quizId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "public"."QuizResult" (
    "quizResultId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("quizResultId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("videoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;
