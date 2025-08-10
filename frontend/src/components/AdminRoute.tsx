import React, { type ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const sessionUser = sessionStorage.getItem("user");
  const parsedUser = sessionUser ? JSON.parse(sessionUser) : null;
  const isAdmin = parsedUser?.role === "ADMIN";
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
