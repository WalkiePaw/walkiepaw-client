import React, { useState, useEffect } from 'react';
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

const ReportManagement = () => {
  const [reportType, setReportType] = useState('board');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const endpoint = reportType === 'board' ? 'http://localhost:8080/api/v1/boardReports' : 'http://localhost:8080/api/v1/memberReports';
      const response = await axios.get(endpoint);
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError(`${reportType === 'board' ? '게시글' : '회원'} 신고 목록을 불러오는 데 실패했습니다.`);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = reportType === 'board' ? `http://localhost:8080/api/v1/boardReports/${id}` : `http://localhost:8080/api/v1/memberReports/${id}`;
      await axios.delete(endpoint);
      fetchReports();
    } catch (err) {
      setError(`신고를 삭제하는 데 실패했습니다.`);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-6">신고 내역 관리</h1>
      <div className="mb-5">
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="board">게시글 신고</option>
          <option value="member">회원 신고</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">신고한 유저</th>
              <th className="py-2 px-4 text-left">{reportType === 'board' ? '게시글 제목' : '신고 대상 회원'}</th>
              <th className="py-2 px-4 text-left">신고 내용</th>
              <th className="py-2 px-4 text-left">신고일</th>
              <th className="py-2 px-4 text-left">신고사유</th>
              <th className="py-2 px-4 text-left">처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="py-2 px-4">{report.id}</td>
                <td className="py-2 px-4">{report.reporterName}</td>
                <td className="py-2 px-4">{reportType === 'board' ? report.boardTitle : report.reportedMemberName}</td>
                <td className="py-2 px-4">{report.content}</td>
                <td className="py-2 px-4">{report.createdAt}</td>
                <td className="py-2 px-4">
                  {reportType === 'board' 
                    ? BoardReportCategory[report.category] 
                    : MemberReportCategory[report.category]}
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(report.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    삭제
                  </button>
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