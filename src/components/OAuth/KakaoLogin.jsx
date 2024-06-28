import React from 'react';
import kakao_login_medium_narrow from '../../assets/kakao_login_medium_narrow.png';

const KakaoLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // oauth 요청 URL
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
      <>
        <button onClick={handleLogin}>
          <img
              src={kakao_login_medium_narrow}
              alt="카카오 로그인"
              style={{ width: 'auto', height: 'auto' }}
          />
        </button>
      </>
  );
};

export default KakaoLogin;