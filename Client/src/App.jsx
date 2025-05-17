import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import HeroSection from "./Pages/Student/HeroSection";
import MainLayout from "./Layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./Pages/Student/Courses";
import MyLearning from "./Pages/Student/MyLearning";
import Profile from "./Pages/Student/Profile";
import Sidebar from "./Pages/Admin/Sidebar";
import Dashboard from "./Pages/Admin/Dashboard";
import CourseTable from "./Pages/Admin/Course/CourseTable";
import AddCourse from "./Pages/Admin/Course/AddCourse";
import EditCourse from "./Pages/Admin/Course/EditCourse";
import CreateLecture from "./Pages/Admin/Lecture/CreateLecture";
import EditLecture from "./Pages/Admin/Lecture/EditLecture";
import CourseDetails from "./Pages/Student/CourseDetails";
import CourseProgress from "./Pages/Student/CourseProgress";
import SearchPage from "./Pages/Student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchasedCourseProtectedRoute from "./components/PurchasedCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            {/* Course */}
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learnings",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-details/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
          <PurchasedCourseProtectedRoute>
            <CourseProgress />
          </PurchasedCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/edit/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/edit/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/edit/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
    </main>
  );
}

export default App;
