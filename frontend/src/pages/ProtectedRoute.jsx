import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { currentUser, userData } = useContext(UserContext);

  // Redirect non-authenticated users to login
  if (!currentUser && !userData) {
    return <Navigate to="/login" />;
  }

  // Redirect non-admin users trying to access admin-only routes
  if (adminOnly && !userData) {
    return <Navigate to="/dashboard/login" />;
  }

  return element;
};

export default ProtectedRoute;
