// 이메일 인증 컴포넌트
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const EmailVerificationButton = ({ memberId, newEmail }) => {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 변경 요청 핸들러
  const handleEmailChangeRequest = async () => {
    if (!newEmail) {
      MySwal.fire({
        title: "이메일 주소가 설정되지 않았습니다",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    setIsLoading(true); // 로딩 상태 시작

    try {
      await axios.post(`http://localhost:8080/api/v1/mail/send`, {
        email: newEmail,
      });
      setIsEmailVerificationSent(true);
      MySwal.fire({
        title: "이메일 인증 메일을 전송했습니다",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.error('이메일 변경 요청 중 오류 발생:', error);
      // 실패 시 처리 로직
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div>
      {!isEmailVerificationSent && (
        <button
          type="button"
          className={`px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleEmailChangeRequest}
          disabled={isLoading}
        >
          {isLoading ? '전송 중...' : '인증'}
        </button>
      )}
      {isEmailVerificationSent && (
        <div>
          <label className="block mt-3 mb-1">인증 코드</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="인증 코드 입력"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationButton;
