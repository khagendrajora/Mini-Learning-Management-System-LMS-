-- CreateTable
CREATE TABLE "public"."Progress" (
    "progressId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "watchedFiles" TEXT[],
    "watchedVideos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("progressId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_moduleId_key" ON "public"."Progress"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("moduleId") ON DELETE RESTRICT ON UPDATE CASCADE;
