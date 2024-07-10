import React from 'react';
import naver_login from '../../assets/naver_login.png';

const NaverLogin = () => {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
  const STATE = "false";
  const REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI


  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

  const handleLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

      return (
          <>
          <button onClick={handleLogin}
                  style={{width: '183px', height: '45px'}}>
            <img
                src={naver_login}
                alt="네이버 로그인"
                style={{width: '100%', height: '100%'}}
            />
          </button>
            </>
      );

};

export default NaverLogin;