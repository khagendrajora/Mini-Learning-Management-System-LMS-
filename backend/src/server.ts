import express, { Request, Response } from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import userRoutes from "../src/Routes/userRoute";
import CourseRoute from "../src/Routes/CourseRoute";
const serviceAccount = require(path.join(__dirname, "../service.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

async function connect() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

app.use("/api", userRoutes);
app.use("/api", CourseRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
