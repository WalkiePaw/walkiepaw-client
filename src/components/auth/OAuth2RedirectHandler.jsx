import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encodedData = params.get('data');

    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const data = JSON.parse(decodedData);

        // 부모 창으로 메시지 전송
        window.opener.postMessage({ type: 'SOCIAL_LOGIN_RESULT', data }, '*');
      } catch (error) {
        console.error('Error processing OAuth2 redirect:', error);
        window.opener.postMessage({ type: 'SOCIAL_LOGIN_ERROR', error: 'Failed to process login' }, '*');
      }
    } else {
      window.opener.postMessage({ type: 'SOCIAL_LOGIN_ERROR', error: 'No data received' }, '*');
    }

    // 팝업 창 닫기
    window.close();
  }, [location]);

  return <div>Processing OAuth2 login...</div>;
};

export default OAuth2RedirectHandler;