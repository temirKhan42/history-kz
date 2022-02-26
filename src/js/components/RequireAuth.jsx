import React from 'react';
import useAuth from '../hooks/index.js';
import { useLocation, Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
