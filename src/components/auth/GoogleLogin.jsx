import React from 'react';
import UseSocialLogin from '../../store/actions/UseSocailLogin.jsx';
import google_login from '../../assets/google_login.png';

const GoogleLogin = () => {
  const handleLogin = UseSocialLogin('Google');

  return (
      <button onClick={() => handleLogin('http://localhost:8080/oauth2/authorization/google')} style={{ width: '183px', height: '45px' }}>
        <img src={google_login} alt="구글" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default GoogleLogin;