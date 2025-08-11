"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const filterFile = (req, file, cb) => {
    const filetypes = /\.(pdf|mp4|jpg|jpeg|png|gif|webp|mov)$/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    }
    else {
        cb(new Error("Files with extension pdf, mp4, jpg, jpeg, png, gif, webp are allowed"));
    }
};
const ensureDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = "uploads/files";
        if (file.fieldname === "thumbnail")
            uploadPath = "uploads/images";
        else if (file.fieldname === "introVideo" ||
            file.fieldname.startsWith("moduleVideo"))
            uploadPath = "uploads/videos";
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix);
    },
});
exports.uploadFile = (0, multer_1.default)({ storage, fileFilter: filterFile });
