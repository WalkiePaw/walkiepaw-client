import React, { useState } from 'react';
import UserInput from '../components/UserInput';
import UserButton from '../components/UserButton';
import pawpaw from '../assets/pawpaw.png';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUserInfo(userInfo => ({
      ...userInfo,
      [name]: value,
    }));
  };

  const isInvaild =
    userInfo.email.includes('@') &&
    userInfo.email.includes('.') &&
    userInfo.password.length >= 8;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
  }}>
        <div className="flex flex-col items-center py-8">
          <img className="h-48" src={pawpaw} alt="발바닥로고" />
          <UserInput
            type="text"
            placeholder="아이디/이메일"
            value={userInfo.email}
            name="email"
            className="w-3/4 px-3 py-2 border-2  border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            onChange={handleInputChange}
          />
          <UserInput
            type="password"
            placeholder="비밀번호"
            value={userInfo.password}
            name="password"
            className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
            onChange={handleInputChange}
          />
          <UserButton
            text="로그인"
            disabled={!isInvaild}
            className={`w-3/4 py-3 rounded-lg transition-colors duration-300 ${
              isInvaild
              ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white'
              : 'bg-gray-300 cursor-not-allowed'
              } mb-4 font-semibold shadow-md`}
            />
          <div className="flex justify-between w-3/4 mb-6">
          <button className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
              아이디 찾기
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
              비밀번호 찾기
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300">
              회원가입
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <div className="h-8 w-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold">G</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;