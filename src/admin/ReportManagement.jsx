// 신고 관리 

import React, { useState, useEffect, useCallback } from 'react';
// 팝업창 
import Swal from 'sweetalert2';
// axios 
import axios from 'axios';

const BoardReportCategory = {
  SPAM: '스팸홍보/도배글',
  PORNOGRAPHY: '음란물',
  ILLEGAL_CONTENT: '불법정보를 포함',
  NOXIOUS: '청소년에게 유해한 내용',
  HARASSMENT: '불쾌한 표현',
  ETC: '기타'
};

const MemberReportCategory = {
  ABUSIVE: '욕설을 사용한 경우',
  HARASSMENT: '불쾌한 대화를 시도한 경우',
  NO_SHOW: '약속 장소에 나타나지 않은 경우',
  SCAMMER: '사기 사용자인 경우',
  DISPUTE: '거래/환불 분쟁이 있는 경우'
};

// 팝업으로 신고 내용 확인하기
const showReportDetails = (title, description) => {
  Swal.fire({
    title: title,
    text: description,
    icon: 'info',
    confirmButtonText: '확인',
  });
};

const ReportManagement = () => {
  const [reportType, setReportType] = useState('board');
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      const endpoint = reportType === 'board' 
        ? 'http://localhost:8080/api/v1/boardReports' 
        : 'http://localhost:8080/api/v1/memberReports';
      console.log('Fetching from endpoint:', endpoint);
      const response = await axios.get(endpoint);
      console.log('Response:', response);
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`${reportType === 'board' ? '게시글' : '회원'} 신고 목록을 불러오는 데 실패했습니다. 오류: ${err.response?.data?.message || err.message}`);
    } 
  }, [reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  const handleAction = async (id, action) => {
    try {
      const endpoint = reportType === 'board' 
        ? `http://localhost:8080/api/v1/boardReports/${id}` 
        : `http://localhost:8080/api/v1/memberReports/${id}`;
      
      switch(action) {
        case 'warn':
          await axios.post(`${endpoint}/warn`);
          break;
        case 'ban':
          await axios.post(`${endpoint}/ban`);
          break;
        case 'ignore':
          await axios.delete(endpoint);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      fetchReports();
      setError(null);
    } catch (err) {
      console.error('Error processing action:', err);
      setError(`처리 중 오류가 발생했습니다: ${err.message}`);
    }
  };
  if (error) return <div>{error}</div>;

    // 날짜 설정
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} / ${hours}:${minutes}`;
    };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">신고 내역 관리</h1>
      <div className="mb-5">
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)}
          className="border p-3 pr-8 rounded w-48"
        >
          <option value="board">게시글 신고</option>
          <option value="member">회원 신고</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">번호</th>
              <th className="py-2 px-4 text-left">신고한 회원명</th>
              <th className="py-2 px-4 text-left">
                {reportType === 'board'
                  ? '닉네임'
                  : '신고 대상 회원명'}
              </th>
              <th className="py-2 px-4 text-left">
                {reportType === 'board' 
                  ? '게시글 제목' 
                  : '신고 제목'}
              </th>
              <th className="py-2 px-4 text-left">신고일</th>
              <th className="py-2 px-4 text-left">신고사유</th>
              <th className="py-2 px-4 text-left">처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  {reportType === 'board' 
                    ? report.writerName
                    : report.reportingMemberName}
                  </td>
                <td className='py-2 px-4'>
                  {reportType === 'board' 
                    ? report.boardWriterNickname
                    : report.reportedMemberName}
                </td>
                <td 
                  onClick={() => showReportDetails(report.title, report.description)}
                  className="py-2 px-4 cursor-pointer">
                  {reportType === 'board' 
                    ? report.boardTitle 
                    : report.memberTitle}
                </td>            
                <td className="py-2 px-4">
                  {reportType === 'board' 
                    ? formatTime(report.boardWriterCreatedDate)
                    : formatTime(report.memberCreatedDate)}
                </td>
                <td className="py-2 px-4">
                  {reportType === 'board' 
                    ? BoardReportCategory[report.reason] 
                    : MemberReportCategory[report.reason]}
                </td>
                <td className="py-2 px-4">
                <select 
            onChange={(e) => handleAction(report.id, e.target.value)}
            className="border rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>선택</option>
            {reportType === 'board'  ? (
              <>
                <option value="restrict">제한된 게시글 처리</option>
                <option value="ignore">신고 무시</option>
              </>
            ) : (
              <>
                <option value="ban">영구정지</option>
                <option value="ignore">신고 무시</option>
              </>
            )}
          </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportManagement;