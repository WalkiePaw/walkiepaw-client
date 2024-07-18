import React from 'react';
import kakao_login_medium_narrow from '../../assets/kakao_login_medium_narrow.png';

const KakaoLogin = ({ onLogin }) => {
  return (
      <button onClick={() => onLogin('kakao')} style={{ width: '183px', height: '45px' }}>
        <img src={kakao_login_medium_narrow} alt="카카오" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};


export default KakaoLogin;