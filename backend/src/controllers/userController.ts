import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/firebaseAuth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const addUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(404).json({ message: "Missing information" });
    }

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: "Invalid Firebase token" });
    }

    const firebaseId = req.user.uid;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email Already used" });
    }
    const hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { firebaseId, name, email, password: hash },
    });
    return res.status(200).json({ newUser });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  console.log("HIt");
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const firebaseId = req.user.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.send(user);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};
