import React from "react";
import Homepage from "./Home";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ token, children }) {
  if (token) {
    return children;
  } else {
    return <Navigate to="/" element={<Homepage />} replace />;
  }
}
export default ProtectedRoute;
