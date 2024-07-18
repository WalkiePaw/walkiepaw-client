import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import VerificationCodeModal from "./VerificationCodeModal.jsx";
import {verifyAuthCode} from "../../Api.jsx";

const StyledButton = styled.button`
  padding: 1rem;
  margin-left: 0.5rem;
  background-color: #E8C5A5;
  border: none;
  border-radius: 5px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  &:hover {
    background-color: #43312A;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmailVerificationButton = ({ newEmail, children }) => {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEmailChangeRequest = async () => {
    if (!newEmail) {
      toast.error("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`http://57.180.244.228:8000/api/v1/mail/send`, {
        email: newEmail,
      });
      setIsEmailVerificationSent(true);

      toast.success("이메일 인증 메일을 전송했습니다", {
        icon: <FaCheck style={{ color: '#43312A' }} />
      });

      setIsModalVisible(true);
    } catch (error) {
      console.error('이메일 변경 요청 중 오류 발생:', error);
      toast.error("이메일 전송 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (verificationCode) => {
    try {
      const response = await axios.post('http://57.180.244.228:8000/api/v1/mail/authCheck', {
        email: newEmail,
        authNum: verificationCode
      });

      if (response.status === 200) {
        setIsModalVisible(false);
        setIsEmailVerified(true);
        toast.success("이메일 인증이 완료되었습니다");
      }
    } catch (error) {
      console.error('이메일 인증 확인 중 오류 발생:', error);
      toast.error(
          `이메일 인증에 실패했습니다.
                    인증 코드를 다시 확인해주세요.`
      );
    }
  };

  return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <StyledButton
            onClick={handleEmailChangeRequest}
            disabled={isLoading || isEmailVerified}
        >
          {isLoading ? '전송 중...' :
              isEmailVerified ? '인증완료' :
                  isEmailVerificationSent ? '재전송' :
                      children}
        </StyledButton>

        <VerificationCodeModal
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSubmit={handleVerificationSubmit}
        />
      </>
  );
};

export default EmailVerificationButton;