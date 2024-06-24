import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import UserButton from "../../components/UserButton.jsx";
import AuthTemplate from "../../components/OAuth/AuthTemplate";
import AddressModal from "../../components/OAuth/AddressModal";
import React, { useState,  useEffect } from "react";

/**
 * 회원가입 폼을 담당하는 컴포넌트
 */

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
  max-width: 500px; // 폼의 최대 너비 설정
  margin: 0 auto; // 폼을 중앙에 배치
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
  padding: 0.8rem;
  margin-left: 0.5rem;
  background-color: #E8C5A5;
  border: none;
  border-radius: 5px;
  white-space: nowrap; // 버튼의 텍스트가 줄바꿈되지 않도록 설정
  cursor: pointer;
  font-size: 1rem;
  color: white;
  &:hover {
    background-color: #43312A;
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

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, clearErrors } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    // 여기서 서버로 데이터를 전송하거나 다른 로직을 실행할 수 있습니다.
  };

  const handleSignUp = async () => {
    const result = await trigger(); // 모든 필드의 유효성 검사 실행
    if (result) {
      handleSubmit(onSubmit)();
    } else {
      // 유효성 검사 실패 시 에러 메시지를 표시하기 위해 모든 필드를 다시 검증
      Object.keys(register).forEach(fieldName => {
        trigger(fieldName);
      });
    }
  };


  const handleAddressComplete = (address) => {
    setValue('address', address);
    clearErrors('address');
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "password" || name === "passwordConfirm") {
        trigger("passwordConfirm");
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger]);


  return (
      <AuthTemplate>
        <Form onSubmit={e => e.preventDefault()}>
          <Label htmlFor="email">이메일</Label>
          <InputGroup>
            <Input
                type="email"
                placeholder="이메일"
                {...register("email", { required: "이메일은 필수 입력 사항입니다." })}
            />
            <Button type="button">인증하기</Button>
          </InputGroup>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <Label htmlFor="password">비밀번호</Label>
          <Input
              type="password"
              placeholder="비밀번호"
              {...register("password", { required: "비밀번호는 필수 입력 사항입니다." })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <Input
              type="password"
              placeholder="비밀번호 확인"
              {...register("passwordConfirm", {
                required: "비밀번호 확인은 필수 입력 사항입니다.",
                validate: value =>
                    value === watch("password") || "비밀번호가 일치하지 않습니다."
              })}
          />
          {errors.passwordConfirm && <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>}


          <Label htmlFor="name">이름</Label>
          <Input
              type="text"
              placeholder="이름"
              {...register("name", { required: "이름은 필수 입력 사항입니다." })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

          <Label htmlFor="nickname">닉네임</Label>
          <InputGroup>
            <Input
                type="text"
                placeholder="닉네임"
                {...register("nickname", { required: "닉네임은 필수 입력 사항입니다." })}
            />
            <Button type="button">중복확인</Button>
          </InputGroup>
          {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}

          <Label htmlFor="phone">전화번호</Label>
          <Input
              type="tel"
              placeholder="전화번호는 숫자로만 입력해주세요('-'제외)"
              {...register("phone", { required: "전화번호는 필수 입력 사항입니다." })}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}

          <Label htmlFor="birthdate">생년월일</Label>
          <Input
              type="date"
              placeholder="생년월일"
              {...register("birthdate", { required: "생년월일은 필수 입력 사항입니다." })}
          />
          {errors.birthdate && <ErrorMessage>{errors.birthdate.message}</ErrorMessage>}

          <Label htmlFor="address">주소</Label>
          <InputGroup>
            <Input
                type="text"
                placeholder="주소"
                {...register("address", { required: "주소는 필수 입력 사항입니다." })}
            />
            <Button type="button" onClick={() => setIsModalOpen(true)}>주소검색</Button>
          </InputGroup>
          {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}

          <TextArea
              placeholder="자기소개"
              rows="4"
              {...register("introduction", { required: "자기소개는 필수 입력 사항입니다." })}
          />
          {errors.introduction && <ErrorMessage>{errors.introduction.message}</ErrorMessage>}

          <Label htmlFor="profilePicture">프로필 사진</Label>
          <Input
              type="file"
              {...register("profilePicture", { required: "프로필 사진은 필수 입력 사항입니다." })}
          />
          {errors.profilePicture && <ErrorMessage>{errors.profilePicture.message}</ErrorMessage>}

        </Form>
        <ButtonContainer>
          <UserButton
              text="회원가입"
              className="w-3/4 py-3 rounded-lg transition-colors duration-300 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white mb-4 font-semibold shadow-md"
              onClick={handleSignUp}
          />
        </ButtonContainer>
        <AddressModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onComplete={handleAddressComplete}
        />
      </AuthTemplate>
  );
};

export default SignUpForm;
