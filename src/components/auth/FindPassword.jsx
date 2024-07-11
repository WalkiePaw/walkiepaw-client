import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import VerificationCodeModal from './VerificationCodeModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-header {
    background-color: #43312A;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-modal-title {
    color: #E8C5A5;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    flex-grow: 1;
  }
  .ant-modal-close {
    position: absolute;
    top: 12px;
    right: 16px;
  }
  .ant-modal-close-x {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(232, 197, 165, 0.2);
    }
  }
  .anticon-close {
    color: #E8C5A5;
    font-size: 14px;
  }
  .ant-modal-body {
    padding: 24px;
    font-size: 16px;
    text-align: center;
  }
  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 10px 16px;
  }
  .ant-btn-primary {
    background-color: #43312A;
    border-color: #43312A;
    &:hover, &:focus {
      background-color: #5A443C;
      border-color: #5A443C;
    }
  }
`;

const StyledInput = styled(Input)`
  border-color: #d9d9d9;
  &:hover, &:focus {
    border-color: #43312A;
    box-shadow: 0 0 0 2px rgba(67, 49, 42, 0.2);
  }
`;

const StyledButton = styled(Button)`
  background-color: #43312A;
  border-color: #43312A;
  color: #E8C5A5;
  &:hover, &:focus {
    background-color: #5A443C;
    border-color: #5A443C;
    color: #E8C5A5;
  }
`;

const FindPassword = ({ onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/members/find-passwd', {
        email: values.email,
        name: values.name
      });

      if (response.data.result === 'SUCCESS') {
        setEmail(values.email);
        setIsModalVisible(true);
        toast.success("인증번호가 이메일로 전송되었습니다.", {
          style: { background: '#E8C5A5', color: '#43312A' }
        });
      } else {
        toast.error("입력한 정보와 일치하는 계정을 찾을 수 없습니다.", {
          style: { background: '#43312A', color: 'white' }
        });
      }
    } catch (error) {
      toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", {
        style: { background: '#43312A', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (verificationCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/mail/authCheck', {
        email: email,
        authNum: verificationCode
      });

      if (response.status === 200) {
        setIsModalVisible(false);
        toast.success(
            `인증이 완료되었습니다.
                      새 비밀번호를 설정해주세요.`,
            {
              style: { background: '#E8C5A5', color: '#43312A' }
            }
        );
        // 여기에 새 비밀번호 설정 로직 추가
      } else {
        toast.error("인증번호가 일치하지 않습니다.", {
          style: { background: '#43312A', color: 'white' }
        });
      }
    } catch (error) {
      toast.error("인증 과정에서 오류가 발생했습니다.", {
        style: { background: '#43312A', color: 'white' }
      });
    }
  };

  return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
              name="email"
              label="이메일"
              rules={[
                { required: true, message: '이메일을 입력해주세요' },
                { type: 'email', message: '유효한 이메일 주소를 입력해주세요' }
              ]}
          >
            <StyledInput />
          </Form.Item>
          <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: '이름을 입력해주세요' }]}
          >
            <StyledInput />
          </Form.Item>
          <Form.Item>
            <StyledButton
                type="primary"
                htmlType="submit"
                loading={loading}
            >
              비밀번호 찾기
            </StyledButton>
          </Form.Item>
        </Form>

        <VerificationCodeModal
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSubmit={handleVerificationSubmit}
        />
      </>
  );
};

export default FindPassword;