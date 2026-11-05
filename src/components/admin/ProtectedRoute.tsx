import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminService } from '../../services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Komponen Protected Route untuk membatasi akses halaman admin
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = adminService.isAuthenticated();

  if (!isAuth) {
    // Redirect ke halaman login dengan menyimpan intended destination
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
