// store/actions/useSocialLogin.js
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../AuthSlice.jsx';

const useSocialLogin = (provider) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (authUrl) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
        authUrl,
        `${provider} Login`,
        `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener('message', function(event) {
      if (event.origin !== "http://localhost:8080") return;

      const data = event.data;
      if (data["account status"] === "New Account") {
        navigate('/signup', { state: { name: data.name, email: data.email } });
      } else {
        dispatch(loginSuccess({ token: data.token }));
        navigate('/');
      }

      popup.close();
    }, false);
  };

  return handleLogin;
};

export default useSocialLogin;