import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middleware/firebaseAuth";
import { PrismaClient } from "@prisma/client";
import admin from "firebase-admin";

import bcrypt from "bcrypt";
import { sendEmail } from "../middleware/setEmail";

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
    sendEmail({
      from: "admin@lms.com",
      to: email,
      subject: "New Account at Mini-LMS",

      html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
         
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Account Creation</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              Your New account at Mini-lms has been successfully created.
            </p>
            
          </div>
        </div>
      </div> `,
    });

    return res.status(200).json({ newUser });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return res.status(404).json({ message: "No user Founde" });
    }
    return res.send(users);
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProgressReport = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId || isNaN(Number(userId))) {
      res.status(400).json({ message: "Invalid or missing userId" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: {
        userId: true,
        name: true,
        email: true,
        progress: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const coursesMap: Record<
      number,
      {
        courseId: number;
        courseTitle: string;
        totalModules: number;
        completedModules: number;
        modules: {
          moduleId: number;
          title: string;
          totalItems: number;
          watchedItems: number;
          progressPercent: number;
        }[];
      }
    > = {};

    user.progress.forEach((p) => {
      const course = p.module.course;
      if (!course) return;

      if (!coursesMap[course.courseId]) {
        coursesMap[course.courseId] = {
          courseId: course.courseId,
          courseTitle: course.courseTitle,
          totalModules: 0,
          completedModules: 0,
          modules: [],
        };
      }

      const totalItems =
        (p.module.file?.length || 0) + (p.module.video?.length || 0);
      const watchedItems =
        (p.watchedFiles?.length || 0) + (p.watchedVideos?.length || 0);
      const progressPercent =
        totalItems > 0 ? (watchedItems / totalItems) * 100 : 0;

      coursesMap[course.courseId].totalModules++;
      if (progressPercent >= 100)
        coursesMap[course.courseId].completedModules++;

      coursesMap[course.courseId].modules.push({
        moduleId: p.moduleId,
        title: p.module.title,
        totalItems,
        watchedItems,
        progressPercent: Number(progressPercent.toFixed(2)),
      });
    });

    const courses = Object.values(coursesMap).map((course) => {
      const overallProgress = course.modules.length
        ? course.modules.reduce((sum, m) => sum + m.progressPercent, 0) /
          course.modules.length
        : 0;

      return {
        ...course,
        overallProgressPercent: Number(overallProgress.toFixed(2)),
      };
    });

    return res.json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      courses,
    });
  } catch (error) {
    console.error("Error fetching user progress report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { firebaseId: true },
    });
    if (user) {
      await admin.auth().deleteUser(user.firebaseId);
    }
    await prisma.progress.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { userId } });
    return res.json({ success: false, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
