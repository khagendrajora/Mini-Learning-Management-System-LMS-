"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseProgress = exports.updateProgress = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hit");
    const { userId, moduleId, videoName, fileName } = req.body;
    try {
        const progress = yield prisma.progress.upsert({
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
        yield prisma.progress.update({
            where: { userId_moduleId: { userId, moduleId } },
            data: {
                watchedFiles: [...new Set(progress.watchedFiles)],
                watchedVideos: [...new Set(progress.watchedVideos)],
            },
        });
        return res.json({ message: "Progress updated" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update progress" });
    }
});
exports.updateProgress = updateProgress;
const getCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.params;
    try {
        const modules = yield prisma.module.findMany({
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
        const percentage = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;
        return res.json({
            totalItems,
            completedItems,
            percentage: Math.round(percentage),
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch progress" });
    }
});
exports.getCourseProgress = getCourseProgress;
