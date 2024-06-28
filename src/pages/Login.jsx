import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInput from '../components/UserInput';
import UserButton from '../components/UserButton';
import KakaoLogin from '../components/OAuth/KakaoLogin';
import NaverLogin from '../components/OAuth/NaverLogin';
import GoogleLogin from '../components/OAuth/GoogleLogin';
import pawpaw from '../assets/pawpaw.png';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      [name]: value,
    }));
    // 입력 값이 변경될 때마다 유효성 검사
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };
    switch (fieldName) {
      case 'email':
        if (!value) {
          newErrors.email = '이메일은 필수입니다.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = '유효한 이메일 주소를 입력해주세요.';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = '비밀번호는 필수입니다.';
        } else if (value.length < 8) {
          newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const isInvalid =
      userInfo.email.includes('@') &&
      userInfo.email.includes('.') &&
      userInfo.password.length >= 8;


  const handleNaverLogin = () => {
    console.log('Naver login clicked');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const onSubmit = () => {
    // 여기에 실제 로그인 로직 구현
    console.log('Login submit');
  };

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="flex flex-col items-center py-8">
          <img className="h-72" src={pawpaw} alt="발바닥로고" />
          <UserInput
              type="text"
              placeholder="아이디/이메일"
              value={userInfo.email}
              name="email"
              className={`w-3/4 px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 ${
                  errors.email ? 'border-red-500' : ''
              }`}
              onChange={handleInputChange}
          />
          {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
          )}
          <UserInput
              type="password"
              placeholder="비밀번호"
              value={userInfo.password}
              name="password"
              className={`w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 ${
                  errors.password ? 'border-red-500' : ''
              }`}
              onChange={handleInputChange}
          />
          {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
          )}
          <UserButton
              text="로그인"
              disabled={!isInvalid}
              className={`w-3/4 py-3 rounded-lg transition-colors duration-300 ${
                  isInvalid
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white'
                      : 'bg-gray-300 cursor-not-allowed'
              } mb-4 font-semibold shadow-md`}
              onClick={onSubmit}
          />
          <div className="flex justify-between w-3/4 mb-6">
            <button className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
              아이디 찾기
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
              비밀번호 찾기
            </button>
            <button
                type="button"
                className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </div>

          <div className="flex justify-between w-3/4 mb-4">
            <KakaoLogin />
            <NaverLogin />
            <GoogleLogin />
          </div>
        </div>
      </div>
  );
};

export default Login;
