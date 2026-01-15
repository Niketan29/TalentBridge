import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const roleHome = (role) => {
  if (role === "recruiter") return "/recruiter";
  if (role === "admin") return "/admin";
  return "/dashboard"; // default student
};

export default function RoleRoute({ allowRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowRoles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}
