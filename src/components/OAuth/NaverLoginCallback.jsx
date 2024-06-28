import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NaverLoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
      .post('http://localhost:8080/api/auth/naver', { code })
      .then(response => {
        const { email, name } = response.data;
        console.log('User info:', email, name);

        // 로그인 상태 유지
        localStorage.setItem('user', JSON.stringify(response.data));

        // 이메일과 이름을 상태로 전달하며 회원가입 페이지로 이동
        navigate('/signup', { state: { email, name, isSocialSignUp: true } });
      })
      .catch(error => {
        console.error('Error during Naver login:', error);
      });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default NaverLoginCallback;
