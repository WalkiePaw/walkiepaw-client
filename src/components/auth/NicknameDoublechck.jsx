import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {checkNickname} from "../../Api.jsx";

const Button = styled.button`
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
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 400px;
  }
`;

const NicknameDoublecheck = ({ nickname, onCheckComplete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkResult, setCheckResult] = useState('');

  const handleCheck = async () => {
    console.log('checking nickname:' , nickname);
    if (!nickname || nickname.trim() === '') {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await checkNickname(nickname);

      let isAvailable = false;
      if (typeof response.data === 'object' && response.data.result === 'AVAILABLE') {
        isAvailable = true;
      } else if (typeof response.data === 'boolean') {
        isAvailable = response.data;
      }

      setCheckResult(isAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
      setIsModalVisible(true);
      onCheckComplete(isAvailable);
    } catch (error) {
      console.error('Nickname check failed:', error);
      setCheckResult('닉네임 확인 중 오류가 발생했습니다.');
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
      <>
        <Button type="button" onClick={() => handleCheck()}>중복확인</Button>
        <StyledModal
            title="닉네임 중복 확인 결과"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="close" onClick={handleModalClose}>
                확인
              </Button>
            ]}
        >
          <p>{checkResult}</p>
        </StyledModal>
      </>
  );
};

export default NicknameDoublecheck;