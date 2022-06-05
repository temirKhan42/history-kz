import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import useAuth from '../hooks/index.js';

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  console.log(auth);
  return auth.isAuthenticated()
    ? children
    : <Navigate to="/app/main" state={{ from: location }} replace />;
}

RequireAuth.propTypes = React.Node;
