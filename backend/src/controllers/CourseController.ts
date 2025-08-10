import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCourse = async (req: Request, res: Response) => {
  console.log("Hit");
  console.log(req.body);
  try {
    const { courseTitle, description, duration, status, path, module } =
      req.body;

    const files = req.files as Express.Multer.File[];

    const thumbnail =
      files.find((f) => f.fieldname === "thumbnail")?.path || "";

    const moduleFilesMap: { [key: number]: string[] } = {};
    const moduleVideosMap: { [key: number]: string[] } = {};

    files.forEach((file) => {
      const fileMatch = file.fieldname.match(/^moduleFile_(\d+)$/);
      const videoMatch = file.fieldname.match(/^moduleVideo_(\d+)$/);

      if (fileMatch) {
        const index = Number(fileMatch[1]);
        if (!moduleFilesMap[index]) moduleFilesMap[index] = [];
        moduleFilesMap[index].push(file.path);
      }

      if (videoMatch) {
        const index = Number(videoMatch[1]);
        if (!moduleVideosMap[index]) moduleVideosMap[index] = [];
        moduleVideosMap[index].push(file.path);
      }
    });

    const parsedModules = module ? JSON.parse(module) : [];
    const moduleData = parsedModules.map((m: any, index: number) => ({
      title: m.title,
      description: m.description,
      file: moduleFilesMap[index] || [],
      video: moduleVideosMap[index] || [],
    }));

    const newCourse = await prisma.course.create({
      data: {
        courseTitle,
        description,
        duration,
        status,
        path,
        thumbnail: String(thumbnail),

        module:
          Array.isArray(moduleData) && moduleData.length > 0
            ? {
                create: moduleData,
              }
            : undefined,
      },
      include: {
        module: true,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "Course Created", newCourse });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ success: false, message: error });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: { module: true },
    });
    return res.send(courses);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }
    const course = await prisma.course.findUnique({
      where: {
        courseId,
      },
      include: { module: true },
    });
    if (!course) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.send(course);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    let { courseTitle, description, duration, status, path } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { courseId },
      include: {
        module: true,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const files = req.files as Express.Multer.File[];

    const newthumbnail = files.find((f) => f.fieldname === "thumbnail")?.path;
    const newIntroVideo = files.find((f) => f.fieldname === "introVideo")?.path;

    const updated = await prisma.course.update({
      where: { courseId: Number(courseId) },
      data: {
        courseTitle,
        description,
        duration,
        status,
        thumbnail: newthumbnail ? newthumbnail : existingCourse.thumbnail,

        path,
      },
      include: { module: true },
    });
    return res
      .status(200)
      .json({ success: true, message: "Successfully Updated", updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await prisma.course.delete({ where: { courseId: Number(req.params.id) } });
    return res.json({ success: false, message: "Course deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const addModuleToCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(id),
      },
    });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const fileArray: string[] = [];
    const videoArray: string[] = [];

    (req.files as Express.Multer.File[]).forEach((f) => {
      if (f.fieldname === "file") {
        fileArray.push(f.path);
      } else {
        videoArray.push(f.path);
      }
    });

    const newModule = await prisma.module.create({
      data: {
        title,
        description,
        file: fileArray,
        video: videoArray,
        courseId: Number(id),
      },
    });
    return res.status(201).json({
      success: true,
      message: `Module added to ${course.courseTitle}`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getModule = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.id;
    const module = await prisma.module.findUnique({
      where: { moduleId: Number(moduleId) },
      include: {
        course: true,
      },
    });
    if (!module) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }
    return res.send(module);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.id;
    const { title, description } = req.body;
    const module = await prisma.module.update({
      where: { moduleId: Number(moduleId) },
      data: { title, description },
      include: { course: true },
    });
    if (!module) {
      return res.status(400).json({ success: false, message: "Failed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully Updated", module });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal" });
  }
};

export const removeModuleFromCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { moduleId: Number(id) },
    });
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    const updatedModule = await prisma.module.update({
      where: { moduleId: Number(id) },
      data: { courseId: null },
    });
    return res.status(200).json({
      success: true,
      message: "Module removed from course successfully",
      data: updatedModule,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const addFileToModule = async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.id;
    const module = await prisma.module.findUnique({
      where: {
        moduleId: Number(moduleId),
      },
    });

    if (!module) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }
    const fileArray: string[] = [];
    const videoArray: string[] = [];

    const files = req.files ? (req.files as Express.Multer.File[]) : [];

    files.forEach((f) => {
      if (f.fieldname === "file") {
        fileArray.push(f.path);
      } else {
        videoArray.push(f.path);
      }
    });

    const update = await prisma.module.update({
      where: { moduleId: Number(moduleId) },
      data: {
        video: [...(module.file || []), ...videoArray],
        file: [...(module.video || []), ...fileArray],
      },
    });
    if (!update) {
      return res.status(409).json({ success: false, message: "Failed" });
    }
    return res.status(200).json({ success: true, message: "Files Added" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal" });
  }
};

export const remoeFilesFromModule = async (req: Request, res: Response) => {
  try {
    const { v, type } = req.body;
    const moduleId = req.params.id;
    const existingModule = await prisma.module.findUnique({
      where: { moduleId: Number(moduleId) },
    });
    if (!existingModule) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }
    let updatedFiles = existingModule.file;
    let updatedVideos = existingModule.video;
    if (type === "file") {
      updatedFiles = existingModule.file.filter((item) => item !== v);
    }
    if (type === "video") {
      updatedVideos = existingModule.video.filter((item) => item !== v);
    }

    const module = await prisma.module.update({
      where: { moduleId: Number(moduleId) },
      data: { file: updatedFiles, video: updatedVideos },
    });
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal" });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    await prisma.module.delete({
      where: {
        moduleId: Number(req.params.id),
      },
    });
    return res.status(200).json({ success: true, message: "Module Deleted" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error });
  }
};
