import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Layout/Layout";
import HomePage from "./pages/HomePage";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Dashboard } from "./pages/Admin/Dashboard";
import AddNewCourse from "./pages/Admin/Course/AddNewCourse";
import { Course } from "./pages/Admin/Course/Course";
import { CourseDescription } from "./pages/Admin/Course/CourseDetail";
import { UpdateCourse } from "./pages/Admin/Course/UpdateCourse";
import UpdateModule from "./pages/Admin/Course/UpdateModule";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { AdminRoute } from "./components/AdminRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UsersList } from "./pages/Admin/UsersList";
import { UserDetail } from "./pages/Admin/UserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/course-detail/:id"
            element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        >
          <Route path="course/addcourse" element={<AddNewCourse />} />
          <Route path="course" element={<Course />} />
          <Route
            path="course/course-detail/:id"
            element={<CourseDescription />}
          />
          <Route path="course/course-update/:id" element={<UpdateCourse />} />
          <Route
            path="course/course-detail/module-update/:id"
            element={<UpdateModule />}
          />
          <Route path="userslist" element={<UsersList />} />
          <Route path="user-detail/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
