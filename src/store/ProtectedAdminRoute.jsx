import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user && (user.authorities === 'ADMIN' || (Array.isArray(user.authorities) && user.authorities.includes('ADMIN')));

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;