import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
  try {
    console.log("Hit");
    console.log(req.body);
    const { message, userId, moduleId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        message,
        userId: Number(userId),
        moduleId: Number(moduleId),
      },
      include: { user: true, module: true },
    });

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create comment" });
  }
};

export const getAllComments = async (_req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        module: true,
      },
    });
    return res.send(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { commentId: Number(id) },
      include: {
        user: true,
        module: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.send(comment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch comment" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const comment = await prisma.comment.update({
      where: { commentId: Number(id) },
      data: { message },
    });

    return res.send({ message: "Comment updated successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.comment.delete({
      where: { commentId: Number(id) },
    });

    return res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};

export const getCommentsByModuleId = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { moduleId: Number(moduleId) },
      include: { user: true, module: true },
    });

    return res.send(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getCommentsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { userId: Number(userId) },
      include: { user: true, module: true },
    });

    res.send(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getCommentsByUserAndModule = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, moduleId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        userId: Number(userId),
        moduleId: Number(moduleId),
      },
      include: {
        user: true,
        module: true,
      },
    });

    return res.send(comments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};
