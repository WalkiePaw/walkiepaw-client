import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {Button, Modal} from 'antd';
import UserInput from '../components/UserInput';
import UserButton from '../components/UserButton';
import KakaoLogin from '../components/auth/KakaoLogin';
import NaverLogin from '../components/auth/NaverLogin';
import GoogleLogin from '../components/auth/GoogleLogin';
import FindEmail from "../components/auth/FindEmail.jsx";
import FindPassword from "../components/auth/FindPassword.jsx";
import pawpaw from '../assets/pawpaw.png';
import { loginSuccess, loginFailure, setLoading } from "../store/AuthSlice.jsx";
import {loginApi} from "../Api.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);



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


  const onSubmit = async () => {
    dispatch(setLoading(true));
    try {
      const response = await loginApi({
        email: userInfo.email,
        password: userInfo.password
      });

      console.log('Login successful:', response.data);
      dispatch(loginSuccess({
        token: response.data.token
      }));
      // 로그인 성공 후 리다이렉트
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      dispatch(loginFailure(error.response?.data?.message || "로그인에 실패했습니다."));
      setModalMessage('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      setIsModalVisible(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const showEmailModal = () => setIsEmailModalVisible(true);
  const handleEmailModalCancel = () => setIsEmailModalVisible(false);
  const handleModalOk = () => setIsModalVisible(false);
  const showPasswordModal = () => setIsPasswordModalVisible(true);
  const handlePasswordModalCancel = () => setIsPasswordModalVisible(false);

  const modalStyle = {
    content: {
      backgroundColor: '#E8C5A5',
      borderRadius: '10px',
    },
    header: {
      backgroundColor: '#43312A',
      color: '#E8C5A5',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      padding: '10px 20px',
    },
    body: {
      padding: '20px',
    },
    footer: {
      backgroundColor: '#E8C5A5',
      borderTop: '1px solid #43312A',
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
      padding: '10px 20px',
    },
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
          {errors.login && (
              <span className="text-sm text-red-500">{errors.login}</span>
          )}
          <div className="flex justify-between w-3/4 mb-6">
            <Button
                onClick={showEmailModal}
                type="link"
                style={{ color: '#43312A' }}
            >
              이메일 찾기
            </Button>
            <Button
                onClick={showPasswordModal}
                type="link"
                style={{ color: '#43312A' }}
            >
              비밀번호 찾기
            </Button>
            <Button
                onClick={() => navigate('/signup')}
                type="link"
                style={{ color: '#43312A' }}
            >
              회원가입
            </Button>
          </div>
          <div className="flex justify-between w-3/4 mb-4">
            <KakaoLogin />
            <NaverLogin />
            <GoogleLogin />
          </div>
        </div>

        <Modal
            title="이메일 찾기"
            open={isEmailModalVisible}
            onCancel={handleEmailModalCancel}
            footer={null}
            style={modalStyle.content}
            bodyStyle={modalStyle.body}
            maskStyle={{ backgroundColor: 'rgba(67, 49, 42, 0.5)' }}
            titleStyle={modalStyle.header}
        >
          <FindEmail onClose={handleEmailModalCancel} />
        </Modal>

        <Modal
            title="비밀번호 찾기"
            open={isPasswordModalVisible}
            onCancel={handlePasswordModalCancel}
            footer={null}
            style={modalStyle.content}
            bodyStyle={modalStyle.body}
            maskStyle={{ backgroundColor: 'rgba(67, 49, 42, 0.5)' }}
            titleStyle={modalStyle.header}
        >
          <FindPassword onClose={handlePasswordModalCancel} />
        </Modal>

        <Modal
            title={<span style={{ color: 'red' }}>로그인 오류</span>}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalOk}
            okText="확인"
            cancelText="취소"
            okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
            cancelButtonProps={{ style: { color: 'red', borderColor: 'red' } }}
        >
          <p>{modalMessage}</p>
        </Modal>
      </div>
  );
};

export default Login;
