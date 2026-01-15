import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterLayout from "../layouts/RecruiterLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import StudentProfilePage from "../pages/student/StudentProfilePage";
import RecruiterProfilePage from "../pages/recruiter/RecruiterProfilePage";

import StudentJobsPage from "../pages/student/StudentJobsPage";
import StudentJobDetailsPage from "../pages/student/StudentJobDetailsPage";
import RecruiterPostJobPage from "../pages/recruiter/RecruiterPostJobPage";
import RecruiterMyJobsPage from "../pages/recruiter/RecruiterMyJobsPage";

import StudentApplicationsPage from "../pages/student/StudentApplicationsPage";
import RecruiterApplicantsPage from "../pages/recruiter/RecruiterApplicantsPage";

import StudentResumesPage from "../pages/student/StudentResumesPage";
import ResumeEditPage from "../pages/student/ResumeEditPage";
import ResumePreviewPage from "../pages/student/ResumePreviewPage";

import ATSCheckerPage from "../pages/student/ATSCheckerPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

import NotificationsPage from "../pages/common/NotificationsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowRoles={["student"]}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="jobs" element={<StudentJobsPage />} />
          <Route path="jobs/:id" element={<StudentJobDetailsPage />} />
          <Route path="applications" element={<StudentApplicationsPage />} />
          <Route path="resumes" element={<StudentResumesPage />} />
          <Route path="resumes/:id/edit" element={<ResumeEditPage />} />
          <Route path="resumes/:id/preview" element={<ResumePreviewPage />} />
          <Route path="ats-checker" element={<ATSCheckerPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="*" element={<div className="p-6 font-bold">404 - Page Not Found</div>} />
        </Route>

        {/* Recruiter */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfilePage />} />
          <Route path="post-job" element={<RecruiterPostJobPage />} />
          <Route path="my-jobs" element={<RecruiterMyJobsPage />} />
          <Route
            path="job/:jobId/applicants"
            element={<RecruiterApplicantsPage />}
          />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowRoles={["admin"]}>
                <AdminDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowRoles={["admin"]}>
                <AdminUsersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
