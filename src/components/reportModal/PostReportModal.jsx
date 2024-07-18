// src/components/ReportModal/ReportModal.jsx
import React, { useState } from "react";
import "./PostReportModal.css";
import axios from "axios";
import { useSelector } from "react-redux";

const ReportModal = ({ onClose, boardId, onSubmit }) => {
  const [showReasons, setShowReasons] = useState(false); // 신고 이유 선택 여부를 관리
  const [selectedReason, setSelectedReason] = useState(""); // 선택된 신고 이유를 저장
  const [otherReason, setOtherReason] = useState(""); // 기타 이유를 입력하는 경우 사용
  const { user } = useSelector((state) => state.auth);

  const reasons = [
    "스팸홍보/도배글입니다.",
    "음란물입니다.",
    "불법정보를 포함하고 있습니다.",
    "청소년에게 유해한 내용입니다.",
    "불쾌한 표현이 있습니다.",
    "기타",
  ];

  const reasonMap = {
    "스팸홍보/도배글입니다.": "SPAM",
    "음란물입니다.": "PORNOGRAPHY",
    "불법정보를 포함하고 있습니다.": "ILLEGAL_CONTENT",
    "청소년에게 유해한 내용입니다.": "NOXIOUS",
    "불쾌한 표현이 있습니다.": "HARASSMENT",
    기타: "ETC",
  };

  // 신고 이유를 선택 했을 때 호출되는 함수
  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setShowReasons(false);
  };

  // 신고 버튼을 눌렀을 때 호출되는 함수
  const handleSubmit = async () => {
    let reportContent = null;

    if (selectedReason === "기타") {
      reportContent = otherReason;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/boardReports",
        {
          boardId: boardId,
          reason: reasonMap[selectedReason], // 신고 이유
          content: reportContent, // 기타 유형일 경우 content에 입력값 전달
          memberId: user.id, // 신고한 유저 Id
        }
      );

      if (response.status === 201) {
        alert("신고가 정상적으로 접수되었습니다.");
      }
    } catch (error) {
      console.error("신고 요청 실패", error);
      alert("신고 요청에 실패했습니다.");
    }

    onSubmit(reasonMap[selectedReason]); // 부모 컴포넌트에 신고 이유를 전달
    onClose(); // 신고 모달 닫기
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
            {selectedReason || "신고 이유를 선택해주세요."}
            <span className={`arrow ${showReasons ? "open" : ""}`}>▼</span>
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
        {selectedReason === "기타" && (
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
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
