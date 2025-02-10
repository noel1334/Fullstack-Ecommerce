import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";


const PrivateRoute = ({ element, isAdminRoute = false }) => {
  const { currentUser, userData } = useContext(UserContext); 
  // Redirect to the appropriate login page based on whether it's an admin route or not
  if (isAdminRoute && !userData) {
    return <Navigate to="/dashboard/login" replace />;
  }

  if (!isAdminRoute && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return element; 
};

export default PrivateRoute;
