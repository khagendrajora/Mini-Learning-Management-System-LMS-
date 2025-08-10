import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/firebaseAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCourse = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};
