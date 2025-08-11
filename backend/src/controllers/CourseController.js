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
exports.deleteModule = exports.remoeFilesFromModule = exports.addFileToModule = exports.removeModuleFromCourse = exports.updateModule = exports.getModule = exports.addModuleToCourse = exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.getCourses = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Hit");
    console.log(req.body);
    try {
        const { courseTitle, description, duration, status, path, module } = req.body;
        const files = req.files;
        const thumbnail = ((_a = files.find((f) => f.fieldname === "thumbnail")) === null || _a === void 0 ? void 0 : _a.path) || "";
        const moduleFilesMap = {};
        const moduleVideosMap = {};
        files.forEach((file) => {
            const fileMatch = file.fieldname.match(/^moduleFile_(\d+)$/);
            const videoMatch = file.fieldname.match(/^moduleVideo_(\d+)$/);
            if (fileMatch) {
                const index = Number(fileMatch[1]);
                if (!moduleFilesMap[index])
                    moduleFilesMap[index] = [];
                moduleFilesMap[index].push(file.path);
            }
            if (videoMatch) {
                const index = Number(videoMatch[1]);
                if (!moduleVideosMap[index])
                    moduleVideosMap[index] = [];
                moduleVideosMap[index].push(file.path);
            }
        });
        const parsedModules = module ? JSON.parse(module) : [];
        const moduleData = parsedModules.map((m, index) => ({
            title: m.title,
            description: m.description,
            file: moduleFilesMap[index] || [],
            video: moduleVideosMap[index] || [],
        }));
        const newCourse = yield prisma.course.create({
            data: {
                courseTitle,
                description,
                duration,
                status,
                path,
                thumbnail: String(thumbnail),
                module: Array.isArray(moduleData) && moduleData.length > 0
                    ? {
                        create: moduleData,
                    }
                    : undefined,
            },
            include: {
                module: true,
            },
        });
        return res
            .status(201)
            .json({ success: true, message: "Course Created", newCourse });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
    }
});
exports.createCourse = createCourse;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany({
            include: { module: true },
        });
        return res.send(courses);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.getCourses = getCourses;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = Number(req.params.id);
        if (isNaN(courseId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid course ID" });
        }
        const course = yield prisma.course.findUnique({
            where: {
                courseId,
            },
            include: { module: true },
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.send(course);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.getCourse = getCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const courseId = Number(req.params.id);
        let { courseTitle, description, duration, status, path } = req.body;
        const existingCourse = yield prisma.course.findUnique({
            where: { courseId },
            include: {
                module: true,
            },
        });
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        const files = req.files;
        const newthumbnail = (_a = files.find((f) => f.fieldname === "thumbnail")) === null || _a === void 0 ? void 0 : _a.path;
        const newIntroVideo = (_b = files.find((f) => f.fieldname === "introVideo")) === null || _b === void 0 ? void 0 : _b.path;
        const updated = yield prisma.course.update({
            where: { courseId: Number(courseId) },
            data: {
                courseTitle,
                description,
                duration,
                status,
                thumbnail: newthumbnail ? newthumbnail : existingCourse.thumbnail,
                path,
            },
            include: { module: true },
        });
        return res
            .status(200)
            .json({ success: true, message: "Successfully Updated", updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.course.delete({ where: { courseId: Number(req.params.id) } });
        return res.json({ success: false, message: "Course deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.deleteCourse = deleteCourse;
const addModuleToCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const course = yield prisma.course.findUnique({
            where: {
                courseId: Number(id),
            },
        });
        if (!course) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }
        const fileArray = [];
        const videoArray = [];
        req.files.forEach((f) => {
            if (f.fieldname === "file") {
                fileArray.push(f.path);
            }
            else {
                videoArray.push(f.path);
            }
        });
        const newModule = yield prisma.module.create({
            data: {
                title,
                description,
                file: fileArray,
                video: videoArray,
                courseId: Number(id),
            },
        });
        return res.status(201).json({
            success: true,
            message: `Module added to ${course.courseTitle}`,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.addModuleToCourse = addModuleToCourse;
const getModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moduleId = req.params.id;
        const module = yield prisma.module.findUnique({
            where: { moduleId: Number(moduleId) },
            include: {
                course: true,
            },
        });
        if (!module) {
            return res.status(404).json({ success: false, message: "Not Found" });
        }
        return res.send(module);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.getModule = getModule;
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moduleId = req.params.id;
        const { title, description } = req.body;
        const module = yield prisma.module.update({
            where: { moduleId: Number(moduleId) },
            data: { title, description },
            include: { course: true },
        });
        if (!module) {
            return res.status(400).json({ success: false, message: "Failed" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Successfully Updated", module });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal" });
    }
});
exports.updateModule = updateModule;
const removeModuleFromCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const module = yield prisma.module.findUnique({
            where: { moduleId: Number(id) },
        });
        if (!module) {
            return res
                .status(404)
                .json({ success: false, message: "Module not found" });
        }
        const updatedModule = yield prisma.module.update({
            where: { moduleId: Number(id) },
            data: { courseId: null },
        });
        return res.status(200).json({
            success: true,
            message: "Module removed from course successfully",
            data: updatedModule,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.removeModuleFromCourse = removeModuleFromCourse;
const addFileToModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moduleId = req.params.id;
        const module = yield prisma.module.findUnique({
            where: {
                moduleId: Number(moduleId),
            },
        });
        if (!module) {
            return res.status(404).json({ success: false, message: "Not Found" });
        }
        const fileArray = [];
        const videoArray = [];
        const files = req.files ? req.files : [];
        files.forEach((f) => {
            if (f.fieldname === "file") {
                fileArray.push(f.path);
            }
            else {
                videoArray.push(f.path);
            }
        });
        const update = yield prisma.module.update({
            where: { moduleId: Number(moduleId) },
            data: {
                video: [...(module.file || []), ...videoArray],
                file: [...(module.video || []), ...fileArray],
            },
        });
        if (!update) {
            return res.status(409).json({ success: false, message: "Failed" });
        }
        return res.status(200).json({ success: true, message: "Files Added" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal" });
    }
});
exports.addFileToModule = addFileToModule;
const remoeFilesFromModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { v, type } = req.body;
        const moduleId = req.params.id;
        const existingModule = yield prisma.module.findUnique({
            where: { moduleId: Number(moduleId) },
        });
        if (!existingModule) {
            return res
                .status(404)
                .json({ success: false, message: "Module not found" });
        }
        let updatedFiles = existingModule.file;
        let updatedVideos = existingModule.video;
        if (type === "file") {
            updatedFiles = existingModule.file.filter((item) => item !== v);
        }
        if (type === "video") {
            updatedVideos = existingModule.video.filter((item) => item !== v);
        }
        const module = yield prisma.module.update({
            where: { moduleId: Number(moduleId) },
            data: { file: updatedFiles, video: updatedVideos },
        });
        return res.status(200).json({ success: true, message: "Updated" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal" });
    }
});
exports.remoeFilesFromModule = remoeFilesFromModule;
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.module.delete({
            where: {
                moduleId: Number(req.params.id),
            },
        });
        return res.status(200).json({ success: true, message: "Module Deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.deleteModule = deleteModule;
