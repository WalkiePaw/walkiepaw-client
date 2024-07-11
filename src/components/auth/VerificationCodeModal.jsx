import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 400px;
  }
`;

const VerificationCodeModal = ({ visible, onCancel, onSubmit }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = () => {
    onSubmit(verificationCode);
  };

  return (
      <StyledModal
          title="인증번호를 입력해주세요"
          open={visible}
          onCancel={onCancel}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              취소
            </Button>,
            <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                style={{ backgroundColor: '#E8C5A5', borderColor: '#E8C5A5' }}
            >
              확인
            </Button>,
          ]}
      >
        <Input
            placeholder="6자리 숫자 코드"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ fontSize: '16px', padding: '10px' }}
        />
      </StyledModal>
  );
};

export default VerificationCodeModal;