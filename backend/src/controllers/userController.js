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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserProgressReport = exports.getUsers = exports.login = exports.addUser = void 0;
const client_1 = require("@prisma/client");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const setEmail_1 = require("../middleware/setEmail");
const prisma = new client_1.PrismaClient();
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(404).json({ message: "Missing information" });
        }
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ message: "Invalid Firebase token" });
        }
        const firebaseId = req.user.uid;
        const existingUser = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email Already used" });
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: { firebaseId, name, email, password: hash },
        });
        (0, setEmail_1.sendEmail)({
            from: "admin@lms.com",
            to: email,
            subject: "New Account at Mini-LMS",
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
         
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Account Creation</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your New account at Mini-lms has been successfully created.
            </p>
            
          </div>
        </div>
      </div> `,
        });
        return res.status(200).json({ newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addUser = addUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.uid)) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        const firebaseId = req.user.uid;
        const user = yield prisma.user.findUnique({
            where: { firebaseId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.send(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        if (!users) {
            return res.status(404).json({ message: "No user Founde" });
        }
        return res.send(users);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsers = getUsers;
const getUserProgressReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId || isNaN(Number(userId))) {
            res.status(400).json({ message: "Invalid or missing userId" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { userId: Number(userId) },
            select: {
                userId: true,
                name: true,
                email: true,
                progress: {
                    include: {
                        module: {
                            include: {
                                course: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const coursesMap = {};
        user.progress.forEach((p) => {
            var _a, _b, _c, _d;
            const course = p.module.course;
            if (!course)
                return;
            if (!coursesMap[course.courseId]) {
                coursesMap[course.courseId] = {
                    courseId: course.courseId,
                    courseTitle: course.courseTitle,
                    totalModules: 0,
                    completedModules: 0,
                    modules: [],
                };
            }
            const totalItems = (((_a = p.module.file) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = p.module.video) === null || _b === void 0 ? void 0 : _b.length) || 0);
            const watchedItems = (((_c = p.watchedFiles) === null || _c === void 0 ? void 0 : _c.length) || 0) + (((_d = p.watchedVideos) === null || _d === void 0 ? void 0 : _d.length) || 0);
            const progressPercent = totalItems > 0 ? (watchedItems / totalItems) * 100 : 0;
            coursesMap[course.courseId].totalModules++;
            if (progressPercent >= 100)
                coursesMap[course.courseId].completedModules++;
            coursesMap[course.courseId].modules.push({
                moduleId: p.moduleId,
                title: p.module.title,
                totalItems,
                watchedItems,
                progressPercent: Number(progressPercent.toFixed(2)),
            });
        });
        const courses = Object.values(coursesMap).map((course) => {
            const overallProgress = course.modules.length
                ? course.modules.reduce((sum, m) => sum + m.progressPercent, 0) /
                    course.modules.length
                : 0;
            return Object.assign(Object.assign({}, course), { overallProgressPercent: Number(overallProgress.toFixed(2)) });
        });
        return res.json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            courses,
        });
    }
    catch (error) {
        console.error("Error fetching user progress report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserProgressReport = getUserProgressReport;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const user = yield prisma.user.findUnique({
            where: { userId },
            select: { firebaseId: true },
        });
        if (user) {
            yield firebase_admin_1.default.auth().deleteUser(user.firebaseId);
        }
        yield prisma.progress.deleteMany({ where: { userId } });
        yield prisma.user.delete({ where: { userId } });
        return res.json({ success: false, message: "User deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
});
exports.deleteUser = deleteUser;
