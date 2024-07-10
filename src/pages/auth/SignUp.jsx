import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UserButton from '../../components/UserButton.jsx';
import ImageUpload from '../../components/ImageUpload.jsx';
import EmailVerificationButton from '../../components/EmailVerification.jsx';
import React, { useState, useEffect } from 'react';
import BirthDatePicker from '../../components/BirthDatePicker.jsx';
import { Modal } from 'antd';
import AuthTemplate from '../../components/auth/AuthTemplate.jsx';
import AddressModal from '../../components/auth/AddressModal.jsx';

const Label = styled.label`
  margin-bottom: 0.1rem;
  font-weight: bold;
  color: #333;
  font-family: 'NEXON Lv1 Gothic OTF';
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
`;

const Button = styled.button`
  padding: 1rem;
  margin-left: 0.5rem;
  background-color: #e8c5a5;
  border: none;
  border-radius: 5px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  &:hover {
    background-color: #43312a;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
`;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [photo, setProfileImageUrl] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isSocialSignUp = location.state?.isSocialSignUp || false;

  useEffect(() => {
    if (location.state) {
      const { email, name } = location.state;
      setValue('email', email);
      setValue('name', name);
    }
  }, [location.state, setValue]);

  const submitSignUp = async (data) => {
    try {
      const signUpData = { ...data, photo };
      const response = await axios.post('http://localhost:8080/api/v1/members', signUpData);
      console.log('회원가입 성공:', response.data);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      Modal.error({
        title: '회원가입 실패',
        content: error.response?.data?.message || '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const handleSignUp = async () => {
    const result = await trigger();
    if (result) {
      const formData = watch();
      await submitSignUp(formData);
    }
  };

  const handleSuccessModalOk = () => {
    setIsSuccessModalVisible(false);
    navigate('/');
  };

  const handleAddressSearch = () => setIsModalOpen(true);

  const handleAddressComplete = (newAddress) => {
    setValue('address', newAddress);
    setAddress(newAddress);
    clearErrors('address');
    setIsModalOpen(false);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const formattedNumber = formatPhoneNumber(value);
    setValue('phoneNumber', formattedNumber);
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'password' || name === 'passwordConfirm') {
        trigger('passwordConfirm');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  return (
    <AuthTemplate>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Label htmlFor="email">이메일</Label>
        <InputGroup>
          <Input
            type="email"
            placeholder="이메일"
            readOnly={isSocialSignUp}
            {...register('email', { required: '이메일은 필수 입력 사항입니다.' })}
          />
          {!isSocialSignUp && <EmailVerificationButton newEmail={watch('email')}>인증하기</EmailVerificationButton>}
        </InputGroup>
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

        {!isSocialSignUp && (
          <>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호"
              {...register('password', {
                required: '비밀번호는 필수 입력 사항입니다.',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다.',
                },
              })}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              {...register('passwordConfirm', {
                required: '비밀번호 확인은 필수 입력 사항입니다.',
                validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
              })}
            />
            {errors.passwordConfirm && <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>}
          </>
        )}

        <Label htmlFor="name">이름</Label>
        <Input
          type="text"
          placeholder="이름"
          readOnly={isSocialSignUp}
          {...register('name', { required: '이름은 필수 입력 사항입니다.' })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Label htmlFor="nickname">닉네임</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="닉네임"
            {...register('nickname', { required: '닉네임은 필수 입력 사항입니다.' })}
          />
          <Button type="button">중복확인</Button>
        </InputGroup>
        {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}

        <Label htmlFor="phoneNumber">전화번호</Label>
        <Input
          type="tel"
          placeholder="전화번호는 숫자로만 입력해주세요('-'제외)"
          {...register('phoneNumber', {
            required: '전화번호는 필수 입력 사항입니다.',
            pattern: {
              value: /^010-?([0-9]{4})-?([0-9]{4})$/,
              message: '올바른 전화번호 형식이 아닙니다.',
            },
          })}
          onChange={handlePhoneNumberChange}
        />
        {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>}

        <Label htmlFor="birthdate">생년월일</Label>
        <BirthDatePicker
          selected={birthDate}
          onChange={(date) => {
            setBirthDate(date);
            setValue('birth', date.toISOString().split('T')[0]);
          }}
          error={errors.birth?.message}
        />
        {errors.birthdate && <ErrorMessage>{errors.birthdate.message}</ErrorMessage>}

        <Label htmlFor="address">주소</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="주소를 검색해주세요"
            readOnly={true}
            value={address}
            {...register('address', { required: '주소는 필수 입력 사항입니다.' })}
          />
          <Button type="button" onClick={handleAddressSearch}>
            {address ? '주소 재검색' : '주소 검색'}
          </Button>
        </InputGroup>
        {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}

        <Label htmlFor="profile">소개</Label>
        <TextArea placeholder="자신을 자유롭게 소개해주세요 :)" rows="4" {...register('profile')} />

        <Label htmlFor="profilePicture">프로필 사진</Label>
        <ImageUpload
          onImageUpload={(url) => {
            setProfileImageUrl(url);
            setValue('photo', url);
          }}
        />

        <ButtonContainer>
          <UserButton
            text="회원가입"
            className="w-3/4 py-3 rounded-lg transition-colors duration-300 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white mb-4 font-semibold shadow-md"
            onClick={handleSignUp}
          />
        </ButtonContainer>
      </Form>

      <AddressModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} onComplete={handleAddressComplete} />

      <Modal
        title="회원가입 완료"
        open={isSuccessModalVisible}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        okText="확인"
        cancelText="닫기"
      >
        <p>회원가입이 성공적으로 완료되었습니다.</p>
      </Modal>
    </AuthTemplate>
  );
};

export default SignUp;
