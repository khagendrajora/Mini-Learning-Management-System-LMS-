import { Router } from "express";
import { uploadFile } from "../middleware/fileUpload";
import {
  addFileToModule,
  addModuleToCourse,
  createCourse,
  deleteCourse,
  deleteModule,
  getCourse,
  getCourses,
  getModule,
  remoeFilesFromModule,
  removeModuleFromCourse,
  updateCourse,
  updateModule,
} from "../controllers/CourseController";

const router = Router();

router.post(
  "/add-course",
  uploadFile.any(),

  createCourse
);
router.get("/get-allcourse", getCourses);
router.get("/get-course/:id", getCourse);
router.put(
  "/update-course/:id",
  uploadFile.any(),

  updateCourse
);

router.delete("/delete-course/:id", deleteCourse);
// router.post(
//   "/add-module-toCourse/:id",
//   uploadFile.fields([
//     {
//       name: "file",
//       maxCount: 10,
//     },

//     {
//       name: "video",
//       maxCount: 10,
//     },
//   ]),
//   addModuleToCourse
// );

//module
router.get("/get-module/:id", getModule);
router.post("/add-module/:id", uploadFile.any(), addModuleToCourse);
router.delete("/delete-module/:id", deleteModule);
router.patch("/remove-module-fromcourse/:id", removeModuleFromCourse);
router.put("/update-module/:id", updateModule);
router.put("/add-file-to-module/:id", uploadFile.any(), addFileToModule);
router.put("/remove-files-from-module/:id", remoeFilesFromModule);

export default router;
