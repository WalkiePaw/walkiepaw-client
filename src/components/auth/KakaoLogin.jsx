import React from 'react';
import UseSocialLogin from '../../store/actions/UseSocailLogin.jsx'
import kakao_login_medium_narrow from '../../assets/kakao_login_medium_narrow.png';

const KakaoLogin = () => {
  const handleSocialLogin = UseSocialLogin();

  const onClick = () => {
    console.log("Kakao login button clicked");
    handleSocialLogin('kakao');
  };

  return (
      <button onClick={onClick} style={{ width: '183px', height: '45px' }}>
        <img src={kakao_login_medium_narrow} alt="카카오" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};


export default KakaoLogin;