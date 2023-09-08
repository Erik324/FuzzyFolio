import React, { useState, useEffect } from "react";
import Homepage from "./Home";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ token, children }) {
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTokenReady(true);
    }, 500);
  }, []);

  if (tokenReady && token) {
    return children;
  } else if (tokenReady && !token) {
    return <Navigate to="/" element={<Homepage />} replace />;
  }
}
export default ProtectedRoute;
