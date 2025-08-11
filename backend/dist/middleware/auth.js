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
exports.checkAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authenticate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            message: "No token provided, authorization denied",
        });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Token is not valid",
        });
    }
}));
exports.authenticate = authenticate;
const checkAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({
            message: "Unauthorized access, user not authenticated",
        });
    }
    if (req.user.role !== "super_admin") {
        res.status(403).json({
            message: "Forbidden,  Access required",
        });
    }
    next();
}));
exports.checkAdmin = checkAdmin;
