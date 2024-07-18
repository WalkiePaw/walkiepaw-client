import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../AuthSlice.jsx';
import LoadingComponent from "../../components/chat/LoadingComponent.jsx";

const UseSocialLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const socialLoginData = params.get('socialLoginData');

    if (socialLoginData) {
      try {
        const data = JSON.parse(decodeURIComponent(socialLoginData));
        if (data['accountStatus'] === 'New Account') {
          navigate('/signup', {
            state: {
              name: data.name,
              email: data.email,
              isSocialSignUp: true
            }
          });
        } else if (data['accountStatus'] === 'Existing Account') {
          dispatch(loginSuccess({ token: data.token }));
          navigate('/');
        }
      } catch (error) {
        console.error('Error processing social login data:', error);
        navigate('/login'); // 에러 발생 시 로그인 페이지로 리다이렉트
      }
    } else {
      navigate('/login'); // socialLoginData가 없을 경우 로그인 페이지로 리다이렉트
    }
  }, [location, navigate, dispatch]);

  return <LoadingComponent message="소셜 로그인 처리 중..." />;
};

export default UseSocialLogin;