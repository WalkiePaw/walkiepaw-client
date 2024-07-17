import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userRole = useSelector(state => state.auth.user?.role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'ADMIN') {
    return <Navigate to="/*" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;