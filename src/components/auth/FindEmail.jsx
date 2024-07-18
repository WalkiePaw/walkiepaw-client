import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

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

const EmailResult = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #43312A;
  margin-bottom: 20px;
`;

const FindEmail = ({ onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [foundEmail, setFoundEmail] = useState('');

  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ phoneNumber: formattedNumber });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://57.180.244.228:8000/api/v1/members/find-email', {
        name: values.name,
        phoneNumber: values.phoneNumber.replace(/-/g, '')
      });
      setFoundEmail(response.data.email);
      setIsModalVisible(true);
    } catch (error) {
      Modal.error({
        title: '이메일 찾기 실패',
        content: '이메일을 찾을 수 없습니다. 입력한 정보를 확인해 주세요.',
        okText: '확인',
        okButtonProps: { style: { backgroundColor: '#43312A', borderColor: '#43312A' } },
        centered: true,
        icon: null,
        maskClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    onClose();
  };

  return (
      <>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: '이름을 입력해주세요' }]}
          >
            <StyledInput />
          </Form.Item>
          <Form.Item
              name="phoneNumber"
              label="전화번호"
              rules={[{ required: true, message: '전화번호를 입력해주세요' }]}
          >
            <StyledInput onChange={handlePhoneNumberChange} />
          </Form.Item>
          <Form.Item>
            <StyledButton
                type="primary"
                htmlType="submit"
                loading={loading}
            >
              이메일 찾기
            </StyledButton>
          </Form.Item>
        </Form>

        <StyledModal
            title="이메일 찾기 결과"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalOk}
            footer={[
              <StyledButton
                  key="submit"
                  type="primary"
                  onClick={handleModalOk}
              >
                확인
              </StyledButton>,
            ]}
            width={400}
            closeIcon={<CloseOutlined style={{ color: '#E8C5A5', fontSize: '14px' }} />}
        >
          <div style={{ textAlign: 'center' }}>
            <EmailResult>{foundEmail}</EmailResult>
            <p style={{ color: '#43312A' }}>다시 로그인 해주세요.</p>
          </div>
        </StyledModal>
      </>
  );
};


export default FindEmail;