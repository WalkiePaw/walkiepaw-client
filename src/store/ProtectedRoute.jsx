import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedRoute = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};


export default ProtectedRoute;