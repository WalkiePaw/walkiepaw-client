import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};


export default ProtectedRoute;