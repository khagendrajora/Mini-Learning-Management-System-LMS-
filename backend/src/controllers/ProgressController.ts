import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProgress = async (req: Request, res: Response) => {
  console.log("Hit");
  const { userId, moduleId, videoName, fileName } = req.body;

  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_moduleId: { userId, moduleId },
      },
      update: {
        watchedFiles: fileName ? { push: fileName } : undefined,
        watchedVideos: videoName ? { push: videoName } : undefined,
      },
      create: {
        userId,
        moduleId,
        watchedFiles: fileName ? [fileName] : [],
        watchedVideos: videoName ? [videoName] : [],
      },
    });

    await prisma.progress.update({
      where: { userId_moduleId: { userId, moduleId } },
      data: {
        watchedFiles: [...new Set(progress.watchedFiles)],
        watchedVideos: [...new Set(progress.watchedVideos)],
      },
    });

    return res.json({ message: "Progress updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update progress" });
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  const { userId, courseId } = req.params;

  try {
    const modules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      include: {
        progress: { where: { userId: Number(userId) } },
      },
    });

    let totalItems = 0;
    let completedItems = 0;

    for (const mod of modules) {
      const filesCount = mod.file.length;
      const videosCount = mod.video.length;

      totalItems += filesCount + videosCount;

      const progress = mod.progress[0];
      if (progress) {
        completedItems += progress.watchedFiles.length;
        completedItems += progress.watchedVideos.length;
      }
    }

    const percentage =
      totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

    return res.json({
      totalItems,
      completedItems,
      percentage: Math.round(percentage),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch progress" });
  }
};
