import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem("userToken") !== null) {
    return children;
  }
  return <Navigate to="/Signin" />;
};

export default ProtectedRoute;
