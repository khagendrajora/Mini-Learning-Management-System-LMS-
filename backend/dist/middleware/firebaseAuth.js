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
exports.firebaseAuthMiddleware = firebaseAuthMiddleware;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function firebaseAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization || "";
        const match = authHeader.match(/^Bearer (.*)$/);
        if (!match) {
            return res.status(401).json({ error: "No authorization" });
        }
        const idToken = match[1];
        try {
            const decoded = yield firebase_admin_1.default.auth().verifyIdToken(idToken);
            req.user = decoded;
            return next();
        }
        catch (err) {
            console.error("verifyIdToken error:", err);
            return res
                .status(401)
                .json({ error: "Unauthorized: invalid or expired token" });
        }
    });
}
