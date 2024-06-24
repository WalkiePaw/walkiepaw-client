import React from 'react';
import { Modal } from 'antd';
import DaumPostcode from 'react-daum-postcode';

const AddressModal = ({ visible, onClose, onComplete }) => {
  const handleComplete = (data) => {
    onComplete(data.address);
    onClose();
  };

  return (
      <Modal
          title="주소 검색"
          open={visible}  // 'visible' 대신 'open' 사용
          onCancel={onClose}
          footer={null}
          centered
      >
        <DaumPostcode onComplete={handleComplete} style={{ width: '100%', height: '400px' }} />
      </Modal>
  );
};

export default AddressModal;