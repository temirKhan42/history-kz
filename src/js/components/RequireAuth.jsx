import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  return auth.isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

RequireAuth.propTypes = React.Node;
