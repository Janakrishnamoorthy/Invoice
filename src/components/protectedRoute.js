// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Check if token exists

  return isAuthenticated ? element : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
