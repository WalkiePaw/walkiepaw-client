import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert } from 'antd';

const KakaoLoginCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const timeoutId = setTimeout(() => {
        setError('로그인 요청 시간이 초과되었습니다. 다시 시도해주세요.');
        setLoading(false);
      }, 60000);

      axios.get('http://localhost:8080//oauth2/authorization/kakao', { code, provider: 'kakao' })
      .then(response => {
        clearTimeout(timeoutId);
        const { email, name } = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/signup', { state: { email, name, isSocialSignUp: true } });
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('Error during Kakao login:', error);
        setError('카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        setLoading(false);
      });
    } else {
      setError('인증 코드를 받지 못했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" tip="카카오 로그인 처리 중..." />
        </div>
    );
  }

  if (error) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Alert
              message="로그인 오류"
              description={error}
              type="error"
              showIcon
          />
        </div>
    );
  }

  return null;
};

export default KakaoLoginCallback;