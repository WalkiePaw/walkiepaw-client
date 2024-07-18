import React from 'react';
import naver_login from '../../assets/naver_login.png';

const NaverLogin = ({ onLogin }) => {
  return (
      <button onClick={() => onLogin('naver')} style={{ width: '183px', height: '45px' }}>
        <img src={naver_login} alt="네이버" style={{ width: '100%', height: '100%' }} />
      </button>
  );
};

export default NaverLogin;