import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Input, Space, Modal, Button as AntButton } from "antd";
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';

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

const LargeModal = styled(Modal)`
  .ant-modal-content {
    width: 400px;
  }
`;

const EmailVerificationButton = ({ newEmail, children }) => {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailChangeRequest = async () => {
    if (!newEmail) {
      toast.error("유효한 이메일 주소를 입력해 주세요.", {
        style: { background: '#43312A', color: 'white' }
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`http://localhost:8080/api/v1/mail/send`, {
        email: newEmail,
      });
      setIsEmailVerificationSent(true);

      toast.success("이메일 인증 메일을 전송했습니다", {
        style: { background: '#E8C5A5', color: '#43312A' },
        icon: <FaCheck style={{ color: '#43312A' }} />
      });

      setIsModalVisible(true);
    } catch (error) {
      console.error('이메일 변경 요청 중 오류 발생:', error);
      toast.error("이메일 전송 중 오류가 발생했습니다", {
        style: { background: '#43312A', color: 'white' }
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
        setIsModalVisible(false);
        setIsEmailVerified(true);
        toast.success("이메일 인증이 완료되었습니다", {
          style: { background: '#E8C5A5', color: '#43312A' }
        });
      }
    } catch (error) {
      console.error('이메일 인증 확인 중 오류 발생:', error);
      toast.error("이메일 인증에 실패했습니다. 인증 코드를 다시 확인해주세요.", {
        style: { background: '#43312A', color: 'white' }
      });
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

        <LargeModal
            title="이메일 인증코드를 입력해주세요."
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <AntButton key="cancel" onClick={() => setIsModalVisible(false)}>
                취소
              </AntButton>,
              <AntButton
                  key="submit"
                  type="primary"
                  onClick={handleVerificationSubmit}
                  style={{ backgroundColor: '#E8C5A5', borderColor: '#E8C5A5' }}
              >
                확인
              </AntButton>,
            ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
                placeholder="6자리 숫자 코드"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{ fontSize: '16px', padding: '10px' }}
            />
          </Space>
        </LargeModal>
      </>
  );
};

export default EmailVerificationButton;