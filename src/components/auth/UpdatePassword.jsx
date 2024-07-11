import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';


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

const StyledInput = styled(Input.Password)`
  margin-bottom: 16px;
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


const UpdatePassword = ({ visible, onCancel, memberId, onPasswordChanged }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await axios.patch(`http://localhost:8080/api/v1/members/${memberId}/passwordUpdate`, {
        password: values.password
      });

      if (response.status === 204) {
        toast.success('비밀번호가 성공적으로 변경되었습니다.', {
          style: { background: '#E8C5A5', color: '#43312A' }
        });
        onPasswordChanged();
        onCancel();
      } else {
        toast.error('비밀번호 변경에 실패했습니다.', {
          style: { background: '#43312A', color: 'white' }
        });
      }
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error('비밀번호 변경 중 오류가 발생했습니다.', {
        style: { background: '#43312A', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <StyledModal
          title="새 비밀번호 설정"
          open={visible}
          onCancel={onCancel}
          footer={null}
          centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
              name="password"
              label="새 비밀번호"
              rules={[
                { required: true, message: '새 비밀번호를 입력해주세요' },
                { min: 8, message: '비밀번호는 8자 이상이어야 합니다' }
              ]}
          >
            <StyledInput />
          </Form.Item>
          <Form.Item
              name="confirmPassword"
              label="비밀번호 확인"
              dependencies={['password']}
              rules={[
                { required: true, message: '비밀번호를 다시 입력해주세요' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
                  },
                }),
              ]}
          >
            <StyledInput />
          </Form.Item>
          <StyledButton onClick={handleSubmit} loading={loading} block>
            비밀번호 변경
          </StyledButton>
        </Form>
      </StyledModal>
  );
};

export default UpdatePassword;
