// SignUpForm.js

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';
import AuthTemplate from '../components/auth/AuthTemplate';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupValidation } from '../yup'; // 경로를 '../yup'으로 수정
import FormErrorMessage from '../components/FormErrorMessage';

const StyledSignUpForm = styled(Form)`
  > div:not(:first-child) {
    margin-top: 30px;
  }

  > div:not(:last-child) {
    position: relative;
  }

  > div > label {
    display: inline-block;
    padding-bottom: 8px;
  }
`;

const SignUpForm = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(signupValidation),
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    console.log(data);
    // 여기에 회원가입 로직을 구현합니다
  };

  return (
    <AuthTemplate>
      <StyledSignUpForm onFinish={handleSubmit(onSubmit)} size="large">
        <div>
          <label htmlFor="userId">아이디</label>
          <Controller
            name="userId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} type="text" placeholder="아이디를 입력해주세요." />
            )}
          />
          {errors.userId && (
            <FormErrorMessage errorMessage={errors.userId.message} />
          )}
        </div>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <Controller
            name="nickname"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} type="text" placeholder="닉네임을 입력해주세요." />
            )}
          />
          {errors.nickname && (
            <FormErrorMessage errorMessage={errors.nickname.message} />
          )}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} type="password" placeholder="비밀번호를 입력해주세요." />
            )}
          />
          {errors.password && (
            <FormErrorMessage errorMessage={errors.password.message} />
          )}
        </div>
        <div>
          <label htmlFor="password2">비밀번호 확인</label>
          <Controller
            name="password2"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} type="password" placeholder="비밀번호를 확인해주세요." />
            )}
          />
          {errors.password2 && (
            <FormErrorMessage errorMessage={errors.password2.message} />
          )}
        </div>
        <div>
          <Controller
            name="term"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                onChange={e => onChange(e.target.checked)}
                checked={value}
              >
                약관에 동의합니다.
              </Checkbox>
            )}
          />
          {errors.term && <FormErrorMessage errorMessage={errors.term.message} />}
        </div>
        <div>
          <Button type="primary" htmlType="submit" block>
            가입하기
          </Button>
        </div>
      </StyledSignUpForm>
    </AuthTemplate>
  );
};

export default SignUpForm;
