import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedChatRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!isLoggedIn || !user) {
    // 채팅 페이지에 대한 특별한 알림
    toast.error("채팅을 위해서는 로그인이 필요합니다.");

    // 현재 위치 정보를 state로 전달
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedChatRoute;
