import React from 'react';
import UseSocialLogin from '../../store/actions/UseSocailLogin.jsx';
import naver_login from '../../assets/naver_login.png';

const NaverLogin = () => {
  const handleSocialLogin = UseSocialLogin();

  const onClick = () => {
    console.log("Naver login button clicked");
    handleSocialLogin('naver');
  };

  return (
      <button onClick={onClick} style={{ width: '183px', height: '45px' }}>
        <img src={naver_login} alt="네이버" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default NaverLogin;