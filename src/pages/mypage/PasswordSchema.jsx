import * as yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

// 비밀번호 유효성 검사 스키마
export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .required("비밀번호는 필수 입력 사항입니다."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
});

const MySwal = withReactContent(Swal);

// 비밀번호 변경 처리 함수
export const handleChangePassword = async () => {
  const { value: formValues } = await MySwal.fire({
    title: '새 비밀번호 입력',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="비밀번호 입력" type="password">' +
      '<input id="swal-input2" class="swal2-input" placeholder="비밀번호 재확인" type="password">',
    focusConfirm: false,
    preConfirm: () => {
      return {
        password: document.getElementById('swal-input1').value,
        passwordConfirm: document.getElementById('swal-input2').value
      };
    }
  });

  if (formValues) {
    try {
      // 입력 받은 값들을 yup 스키마로 유효성 검사
      await passwordSchema.validate(formValues, { abortEarly: false });
      // 비밀번호 변경 API 호출
      const memberId = 1; // 혹은 다른 방식으로 회원 ID 가져오기
      const response = await axios.patch(`http://localhost:8080/api/v1/members/${memberId}/passwordUpdate`, {
        password: formValues.password
      });
      // 유효성 검사 통과 시 SweetAlert2로 성공 메시지 표시
      MySwal.fire({
        icon: 'success',
        title: '성공',
        text: '비밀번호가 성공적으로 변경되었습니다!',
      });
      // TODO: 여기에 비밀번호 변경 API 호출 로직 추가
    } catch (err) {
      // 유효성 검사 실패 시 각 입력 필드에 대한 오류 메시지를 표시
      const errors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      
      MySwal.fire({
        icon: 'error',
        title: '오류',
        html: Object.values(errors).join('<br>'),
      });
    }
  }
};

const MyComponent = () => {
  return (
    <div>
      {/* 비밀번호 변경 버튼 */}
      <button
        type="button"
        className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
        onClick={handleChangePassword}
      >
        비밀번호 변경
      </button>
    </div>
  );
};

export default MyComponent;