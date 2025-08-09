import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";

const authenticate = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        message: "Token is not valid",
      });
    }
  }
);

const checkAdmin = asyncHandler(async (req: any, res, next) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized access, user not authenticated",
    });
  }
  if (req.user.role !== "super_admin") {
    res.status(403).json({
      message: "Forbidden,  Access required",
    });
  }
  next();
});
export { authenticate, checkAdmin };
