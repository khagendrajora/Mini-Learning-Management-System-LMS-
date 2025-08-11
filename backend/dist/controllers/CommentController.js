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
exports.getCommentsByUserAndModule = exports.getCommentsByUserId = exports.getCommentsByModuleId = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getAllComments = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Hit");
        console.log(req.body);
        const { message, userId, moduleId } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        const comment = yield prisma.comment.create({
            data: {
                message,
                userId: Number(userId),
                moduleId: Number(moduleId),
            },
            include: { user: true, module: true },
        });
        return res
            .status(201)
            .json({ message: "Comment created successfully", comment });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create comment" });
    }
});
exports.createComment = createComment;
const getAllComments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield prisma.comment.findMany({
            include: {
                user: true,
                module: true,
            },
        });
        return res.send(comments);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
});
exports.getAllComments = getAllComments;
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comment = yield prisma.comment.findUnique({
            where: { commentId: Number(id) },
            include: {
                user: true,
                module: true,
            },
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.send(comment);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch comment" });
    }
});
exports.getCommentById = getCommentById;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const comment = yield prisma.comment.update({
            where: { commentId: Number(id) },
            data: { message },
        });
        return res.send({ message: "Comment updated successfully", comment });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to update comment" });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.comment.delete({
            where: { commentId: Number(id) },
        });
        return res.send({ message: "Comment deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to delete comment" });
    }
});
exports.deleteComment = deleteComment;
const getCommentsByModuleId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId } = req.params;
        const comments = yield prisma.comment.findMany({
            where: { moduleId: Number(moduleId) },
            include: { user: true, module: true },
        });
        return res.send(comments);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
});
exports.getCommentsByModuleId = getCommentsByModuleId;
const getCommentsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const comments = yield prisma.comment.findMany({
            where: { userId: Number(userId) },
            include: { user: true, module: true },
        });
        res.send(comments);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
});
exports.getCommentsByUserId = getCommentsByUserId;
const getCommentsByUserAndModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, moduleId } = req.params;
        const comments = yield prisma.comment.findMany({
            where: {
                userId: Number(userId),
                moduleId: Number(moduleId),
            },
            include: {
                user: true,
                module: true,
            },
        });
        return res.send(comments);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
});
exports.getCommentsByUserAndModule = getCommentsByUserAndModule;
