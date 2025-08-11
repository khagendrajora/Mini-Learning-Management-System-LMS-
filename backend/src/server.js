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
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const userRoute_1 = __importDefault(require("../src/Routes/userRoute"));
const CourseRoute_1 = __importDefault(require("../src/Routes/CourseRoute"));
const CommentRoute_1 = __importDefault(require("../src/Routes/CommentRoute"));
const serviceAccount = require(path_1.default.join(__dirname, "../service.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log("Connected to the database successfully.");
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
            process.exit(1);
        }
    });
}
app.use("/api", userRoute_1.default);
app.use("/api", CourseRoute_1.default);
app.use("/api", CommentRoute_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const PORT = process.env.PORT || 3000;
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
