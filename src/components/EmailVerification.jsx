import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { Input, Space, Modal, Button as AntButton } from "antd";
import styled from 'styled-components';

const MySwal = withReactContent(Swal);


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

const EmailVerificationButton = ({newEmail, children }) => {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailChangeRequest = async () => {
    if (!newEmail) {
      MySwal.fire({
        title: "이메일 주소가 설정되지 않았습니다",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`http://localhost:8080/api/v1/mail/send`, {
        email: newEmail,
      });
      setIsEmailVerificationSent(true);
      setIsModalVisible(true);
      MySwal.fire({
        title: "이메일 인증 메일을 전송했습니다",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.error('이메일 변경 요청 중 오류 발생:', error);
      MySwal.fire({
        title: "이메일 전송 중 오류가 발생했습니다",
        icon: "error",
        confirmButtonText: "확인",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/mail/authCheck', {
        email: newEmail,
        authNum: verificationCode
      });

      if (response.status === 200) {
        setIsEmailVerified(true);
        MySwal.fire({
          title: "이메일 인증이 완료되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('이메일 인증 확인 중 오류 발생:', error);
      MySwal.fire({
        title: "이메일 인증에 실패했습니다",
        text: "인증 코드를 다시 확인해주세요",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
      <>
        <StyledButton
            onClick={handleEmailChangeRequest}
            disabled={isLoading || isEmailVerified}
        >
          {isLoading ? '전송 중...' :
              isEmailVerified ? '인증완료' :
                  isEmailVerificationSent ? '재전송' :
                      children}
        </StyledButton>

        <Modal
            title="이메일 인증"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <AntButton key="cancel" onClick={() => setIsModalVisible(false)}>
                취소
              </AntButton>,
              <AntButton key="submit" type="primary" onClick={handleVerificationSubmit}>
                확인
              </AntButton>,
            ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
                placeholder="인증 코드 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Space>
        </Modal>
      </>
  );
};

export default EmailVerificationButton;