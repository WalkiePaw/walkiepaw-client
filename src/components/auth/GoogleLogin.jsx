import React from 'react';
import google_login from '../../assets/google_login.png';

const GoogleLogin = ({ onLogin }) => {
  return (
      <button onClick={() => onLogin('google')} style={{ width: '183px', height: '45px' }}>
        <img src={google_login} alt="구글" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default GoogleLogin;