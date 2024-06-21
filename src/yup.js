// src/yup.js
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().required('이메일은 필수 입력입니다.').email('유효한 이메일 주소를 입력해주세요.'),
  password: yup.string().required('비밀번호는 필수 입력입니다.').min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});



