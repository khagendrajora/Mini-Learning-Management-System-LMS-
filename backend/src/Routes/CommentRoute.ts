import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  getCommentsByModuleId,
  getCommentsByUserAndModule,
  getCommentsByUserId,
  updateComment,
} from "../controllers/CommentController";

const router = Router();

router.post("/add-comment", createComment);
router.get("/get-comment", getAllComments);
router.get("/get-comment-by-id/:id", getCommentById);
router.get("/user-comment/:userId", getCommentsByUserId);
router.get("/module-comment/:moduleId", getCommentsByModuleId);
router.get(
  "/user-comment/:userId/module-comment/:moduleId",
  getCommentsByUserAndModule
);
router.put("/update-comment/:id", updateComment);
router.delete("/delete-comment/:id", deleteComment);

export default router;
