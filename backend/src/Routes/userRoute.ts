import { Router } from "express";
import { firebaseAuthMiddleware } from "../middleware/firebaseAuth";
import { addUser, login } from "../controllers/userController";

const router = Router();

router.post("/add-user", firebaseAuthMiddleware, addUser);
router.post("/login", firebaseAuthMiddleware, login);

export default router;
