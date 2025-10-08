import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const roleId = sessionStorage.getItem("roleId");

  if (!token || roleId !== "1") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
