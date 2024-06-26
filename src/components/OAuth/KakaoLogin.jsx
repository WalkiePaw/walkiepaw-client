import React from 'react';
import kakao_login_medium_narrow from '../../assets/kakao_login_medium_narrow.png';

const KakaoLogin = () => {
  const Rest_api_key = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
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