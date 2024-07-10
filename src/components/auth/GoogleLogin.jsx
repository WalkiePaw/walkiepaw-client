import React from 'react';
import google_login from '../../assets/google_login.png';

const GoogleLogin = () => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('email profile')}`;

  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
      <button onClick={handleLogin} style={{ width: '183px', height: '45px' }}>
        <img src={google_login} alt="구글" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default GoogleLogin;
