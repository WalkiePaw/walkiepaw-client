import React from 'react';
import UseSocialLogin from '../../store/actions/UseSocailLogin.jsx';
import kakao_login_medium_narrow from '../../assets/kakao_login_medium_narrow.png';

const KakaoLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = UseSocialLogin('Kakao');

  return (
      <button onClick={() => handleLogin(KAKAO_AUTH_URL)}>
        <img
            src={kakao_login_medium_narrow}
            alt="카카오 로그인"
            style={{ width: 'auto', height: 'auto' }}
        />
      </button>
  );
};

export default KakaoLogin;