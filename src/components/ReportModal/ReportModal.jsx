// src/components/ReportModal/ReportModal.jsx
import React, { useState } from 'react';
import './ReportModal.css';

const ReportModal = ({ onClose, onSubmit }) => {
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    '스팸홍보/도배글입니다.',
    '음란물입니다.',
    '불법정보를 포함하고 있습니다.',
    '청소년에게 유해한 내용입니다.',
    '불쾌한 표현이 있습니다.',
    '기타',
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setShowReasons(false);
  };

  const handleSubmit = () => {
    onSubmit(selectedReason === '기타' ? otherReason : selectedReason);
    onClose();
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <h2>게시글 신고하기</h2>
        <p>신고하시는 이유를 선택해주세요.</p>
        <div className="reason-selector">
          <div
            className="selected-reason"
            onClick={() => setShowReasons(!showReasons)}
          >
            {selectedReason || '신고 이유를 선택해주세요.'}
            <span className={`arrow ${showReasons ? 'open' : ''}`}>▼</span>
          </div>
          {showReasons && (
            <div className="reason-list">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="reason-option"
                  onClick={() => handleReasonSelect(reason)}
                >
                  {reason}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedReason === '기타' && (
          <textarea
            placeholder="기타를 선택하신 경우 구체적인 내용을 입력해주세요."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
        )}
        <div className="button-group">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedReason}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
