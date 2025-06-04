import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem('user_role');

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRole)) {
    if (!allowedRole.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    if (userRole !== allowedRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
