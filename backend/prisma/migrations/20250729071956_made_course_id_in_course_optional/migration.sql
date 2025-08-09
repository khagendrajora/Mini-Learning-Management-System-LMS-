-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_courseId_fkey";

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE SET NULL ON UPDATE CASCADE;
