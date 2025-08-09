import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const filterFile = (
  req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /\.(pdf|mp4|jpg|jpeg|png|gif|webp|mov)$/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Files with extension pdf, mp4, jpg, jpeg, png, gif, webp are allowed"
      )
    );
  }
};

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/files";
    if (file.fieldname === "thumbnail") uploadPath = "uploads/images";
    else if (
      file.fieldname === "introVideo" ||
      file.fieldname.startsWith("moduleVideo")
    )
      uploadPath = "uploads/videos";
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

export const uploadFile = multer({ storage, fileFilter: filterFile });
