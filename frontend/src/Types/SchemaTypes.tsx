export interface CourseType {
  courseId?: number;
  courseTitle: string;
  description: string;
  duration: string;
  status: string;
  thumbnail?: string;
  path: string;
  module: ModuleType[];
}

export interface ModuleType {
  moduleId?: number;
  title: string;
  description: string;
  file: string[];
  video: string[];
  courseId?: number;
  course?: CourseType;
}

export type Role = "ADMIN" | "STUDENT";

export interface User {
  userId?: number;
  email: string;
  firebaseId: string;
  password: string;
  name: string;
  role: Role;
  createdAt: Date;
  module: ModuleType[];
}

export interface AdminType {
  adminId?: number;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CommentTypes {
  commentId?: number;
  message: string;
  createdAt: string;
  module: ModuleType;
  user: User;
}
