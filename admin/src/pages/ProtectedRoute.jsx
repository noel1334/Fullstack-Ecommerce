import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

const ProtectedRoute = ({ element }) => {
  const { userData } = useContext(UserContext);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
