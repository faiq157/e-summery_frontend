import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Check for user in cookies or local storage
  const isUserLoggedIn = isAuthenticated || !!user || !!localStorage.getItem("user");

  return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;