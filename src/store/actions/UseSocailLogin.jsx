import { useCallback, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../AuthSlice.jsx';


const UseSocialLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const socialLoginData = params.get('socialLoginData');

    if (socialLoginData) {
      try {
        const data = JSON.parse(decodeURIComponent(socialLoginData));
        if (data['account status'] === 'New Account') {
          navigate('/signup', {
            state: {
              name: data.name,
              email: data.email,
              isSocialSignUp: true
            }
          });
        } else if (data['account status'] === 'Existing Account') {
          dispatch(loginSuccess({ token: data.token }));
          navigate('/');
        }
      } catch (error) {
        console.error('Error processing social login data:', error);
      }
    }
  }, [location, navigate, dispatch]);

  const handleSocialLogin = useCallback((provider) => {
    const authUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
    window.location.href = authUrl;
  }, []);

  return handleSocialLogin;
};

export default UseSocialLogin;