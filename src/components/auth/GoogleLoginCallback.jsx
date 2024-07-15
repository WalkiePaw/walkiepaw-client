// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { socialLogin } from '../../store/AuthSlice.jsx';  // authSlice의 실제 경로로 수정해주세요
//
const GoogleLoginCallback = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoggedIn, newUser, error, isLoading } = useSelector(state => state.auth);
//
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//
//     if (code) {
//       dispatch(socialLogin({ code, provider: 'google' }));
//     }
//   }, [dispatch]);
//
//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate('/'); // 로그인 성공 시 홈페이지로 이동
//     } else if (newUser) {
//       navigate('/signup', { state: { ...newUser, isSocialSignUp: true } });
//       console.log('New user data:', newUser);  // 디버깅을 위해 추가
//     } else if (error) {
//       console.error('Error during google login:', error);
//       navigate('/login'); // 에러 발생 시 로그인 페이지로 이동
//     }
//   }, [isLoggedIn, newUser, error, navigate]);
//
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//
//   return null;
};
//
export default GoogleLoginCallback;