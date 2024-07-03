import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/auth';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = isTokenValid(token);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
