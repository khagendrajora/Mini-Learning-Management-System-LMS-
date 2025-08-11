import { Router } from "express";
import { firebaseAuthMiddleware } from "../middleware/firebaseAuth";
import {
  addUser,
  deleteUser,
  getUserProgressReport,
  getUsers,
  login,
} from "../controllers/userController";
import {
  getCourseProgress,
  updateProgress,
} from "../controllers/ProgressController";

const router = Router();

router.post("/add-user", firebaseAuthMiddleware, addUser);
router.post("/login", firebaseAuthMiddleware, login);
router.post("/update-progress", updateProgress);
router.get("/course-progress/:userId/:courseId", getCourseProgress);
router.get("/get-users", getUsers);
router.get("/user-progress/:userId", getUserProgressReport);
router.delete("/delete-user/:id", deleteUser);
export default router;
