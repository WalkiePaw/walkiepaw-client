import React from 'react';
import UseSocialLogin from '../../store/actions/UseSocailLogin.jsx';
import google_login from '../../assets/google_login.png';

const GoogleLogin = () => {
  const handleSocialLogin = UseSocialLogin();

  const onClick = () => {
    console.log("Google login button clicked");
    handleSocialLogin('google');
  };

  return (
      <button onClick={onClick} style={{ width: '183px', height: '45px' }}>
        <img src={google_login} alt="구글" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default GoogleLogin;