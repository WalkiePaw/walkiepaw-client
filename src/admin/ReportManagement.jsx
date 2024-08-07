import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import formatTime from '../util/formatTime';

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
  const [error, setError] = useState(null);
  const [unresolvedOnly, setUnresolvedOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchReports = useCallback(async () => {
    try {
      const endpoint =
        reportType === "board"
          ? "http://57.180.244.228:8000/api/v1/boardReports/list"
          : "http://57.180.244.228:8000/api/v1/memberReports/list";
      const params = {
        page: currentPage,
        size: pageSize,
        status: unresolvedOnly ? "UNRESOLVED" : undefined,
      };

      const response = await axios.get(endpoint, { params });
      console.log("Response:", response);
      setReports(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(
        `${
          reportType === "board" ? "게시글" : "회원"
        } 신고 목록을 불러오는 데 실패했습니다. 오류: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  }, [reportType, currentPage, pageSize, unresolvedOnly]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAction = async (reportId, action, reportType, currentStatus) => {
    try {
      let endpoint;
      let status;
      if (reportType === "board") {
        status =
          action === "blind"
            ? "blind"
            : action === "ignore"
            ? "ignore"
            : "UNRESOLVED";
        endpoint = `http://57.180.244.228:8000/api/v1/boardReports/${reportId}/${status}`;
      } else if (reportType === "member") {
        status =
          action === "ban"
            ? "ban"
            : action === "ignore"
            ? "ignore"
            : "UNRESOLVED";
        endpoint = `http://57.180.244.228:8000/api/v1/memberReports/${reportId}/${status}`;
      }

      // 현재 상태와 새로운 상태가 다를 때만 API 호출
      if (currentStatus !== status) {
        await axios.patch(endpoint);

        // 로컬 상태 업데이트
        setReports((prevReports) =>
          prevReports.map((report) =>
            (reportType === "board"
              ? report.boardReportId
              : report.memberReportId) === reportId
              ? { ...report, status }
              : report
          )
        );
      }
      setError(null);
    } catch (err) {
      console.error("Error processing action:", err);
      setError(`처리 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  // 처리되지 않은 항목만 보기
  const filteredReports = unresolvedOnly
    ? reports.filter(
        (report) => report.status === "UNRESOLVED" || report.status == null
      )
    : reports;

  // 관리 상태 텍스트로 변환
  const getStatusText = (status, reportType) => {
    if (status === "UNRESOLVED" || status == null) return "미처리";
    if (reportType === "board") {
      return status === "blind" ? "제한된 게시글" : "신고 무시";
    } else {
      return status === "ban" ? "영구정지" : "신고 무시";
    }
  };

  // 게시판 신고 사유가 '기타'일 경우 || 회원 신고일 경우 신고 내용 확인 가능
  const fetchReportContent = async (id) => {
    try {
      const endpoint =
        reportType === "board"
          ? `http://57.180.244.228:8000/api/v1/boardReports/${id}`
          : `http://57.180.244.228:8000/api/v1/memberReports/${id}`;
      const response = await axios.get(endpoint);
      return response.data.content;
    } catch (error) {
      console.error("Error fetching report content:", error);
      return "내용을 가져오는 데 실패했습니다.";
    }
  };

  const showReportContent = async (id) => {
    Swal.fire({
      title: "내용 로딩 중...",
      text: "잠시만 기다려주세요.",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    const content = await fetchReportContent(id, reportType);

    Swal.fire({
      title: "신고 내용",
      text: content,
      icon: "info",
      confirmButtonText: "확인",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (error) return <div>{error}</div>;

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
      <div>
        <label className="ml-3">
          <input
            type="checkbox"
            checked={unresolvedOnly}
            onChange={() => setUnresolvedOnly(!unresolvedOnly)}
            className="mr-1"
          />
          처리되지 않은 항목만 보기
        </label>
      </div>
      {reports.length === 0 ? (
        <p className="text-center text-gray-500">
          {unresolvedOnly
            ? "처리되지 않은 항목이 없습니다."
            : "신고 내역이 없습니다."}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">번호</th>
                  <th className="py-2 px-4 text-left">신고한 회원명</th>
                  <th className="py-2 px-4 text-left">
                    {reportType === "board"
                      ? "게시글 작성자"
                      : "신고 대상 회원명"}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {reportType === "board" ? "게시글 제목" : "신고 제목"}
                  </th>
                  <th className="py-2 px-4 text-left">신고일</th>
                  <th className="py-2 px-4 text-left">신고사유</th>
                  <th className="py-2 px-4 text-left">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">
                      {reportType === "board"
                        ? report.writerName
                        : report.reportingMemberName}
                    </td>
                    <td className="py-2 px-4">
                      {reportType === "board"
                        ? report.boardWriterName
                        : report.reportedMemberName}
                    </td>
                    <td className="py-2 px-4">
                      {(reportType === "board" && report.reason === "ETC") ||
                      reportType === "member" ? (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            showReportContent(
                              reportType === "board"
                                ? report.boardReportId
                                : report.memberReportId,
                              reportType
                            )
                          }
                        >
                          {reportType === "board"
                            ? report.boardTitle
                            : report.title}
                        </span>
                      ) : reportType === "board" ? (
                        report.boardTitle
                      ) : (
                        report.title
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {reportType === "board"
                        ? formatTime(report.boardWriterCreatedDate)
                        : formatTime(report.createdDate)}
                    </td>
                    <td className="py-2 px-4">
                      {reportType === "board"
                        ? BoardReportCategory[report.reason]
                        : MemberReportCategory[report.reason]}
                    </td>
                    <td className="py-2 px-4">
                      {report.status === "UNRESOLVED" ||
                      report.status == null ? (
                        <select
                          onChange={(e) =>
                            handleAction(
                              reportType === "board"
                                ? report.boardReportId
                                : report.memberReportId,
                              e.target.value,
                              reportType,
                              report.status
                            )
                          }
                          className="border rounded px-2 py-1"
                          value={report.status || ""}
                        >
                          <option value="" disabled>
                            선택
                          </option>
                          {reportType === "board" ? (
                            <>
                              <option value="blind">제한된 게시글 처리</option>
                              <option value="ignore">신고 무시</option>
                            </>
                          ) : (
                            <>
                              <option value="ban">영구정지</option>
                              <option value="ignore">신고 무시</option>
                            </>
                          )}
                        </select>
                      ) : (
                        getStatusText(report.status, reportType)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === i ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ReportManagement;