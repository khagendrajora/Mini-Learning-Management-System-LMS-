"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileUpload_1 = require("../middleware/fileUpload");
const CourseController_1 = require("../controllers/CourseController");
const router = (0, express_1.Router)();
router.post("/add-course", fileUpload_1.uploadFile.any(), CourseController_1.createCourse);
router.get("/get-allcourse", CourseController_1.getCourses);
router.get("/get-course/:id", CourseController_1.getCourse);
router.put("/update-course/:id", fileUpload_1.uploadFile.any(), CourseController_1.updateCourse);
router.delete("/delete-course/:id", CourseController_1.deleteCourse);
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
router.get("/get-module/:id", CourseController_1.getModule);
router.post("/add-module/:id", fileUpload_1.uploadFile.any(), CourseController_1.addModuleToCourse);
router.delete("/delete-module/:id", CourseController_1.deleteModule);
router.patch("/remove-module-fromcourse/:id", CourseController_1.removeModuleFromCourse);
router.put("/update-module/:id", CourseController_1.updateModule);
router.put("/add-file-to-module/:id", fileUpload_1.uploadFile.any(), CourseController_1.addFileToModule);
router.put("/remove-files-from-module/:id", CourseController_1.remoeFilesFromModule);
exports.default = router;
