// src/yup.js
import * as yup from 'yup';

export const signupValidation = yup.object().shape({
  userId: yup.string().required('아이디는 필수 항목입니다.'),
  nickname: yup.string().required('닉네임은 필수 항목입니다.'),
  password: yup.string()
    .required('비밀번호는 필수 항목입니다.')
    .min(6, '비밀번호는 최소 6자리여야 합니다.'),
  password2: yup.string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인은 필수 항목입니다.'),
  term: yup.boolean()
    .oneOf([true], '약관에 동의해야 합니다.')
    .required('약관에 동의해야 합니다.'),
});
