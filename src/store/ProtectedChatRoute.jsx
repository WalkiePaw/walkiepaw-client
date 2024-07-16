import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyToken, setInitialState } from '../store/AuthSlice.jsx';

const ProtectedChatRoute = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      dispatch(setInitialState());
      dispatch(verifyToken()).unwrap()
      .catch(() => {
        toast.error('채팅을 위해서는 로그인이 필요합니다.', {
          autoClose: 3000 // 3초 동안 표시
        });
        // 토큰 검증 실패 시 로그인 페이지로 리디렉션
        window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
      });
    }
  }, [dispatch, isLoggedIn, user, location.pathname]);


  // 초기 상태에서는 콘텐츠를 렌더링
  return <Outlet />;
};

export default ProtectedChatRoute;