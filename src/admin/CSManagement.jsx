// 고객센터 문의내역 관리 및 답변하기

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CSManagement = () => {
  const [qnaList, setQnaList] = useState([]);
  const [selectedQna, setSelectedQna] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchQnaList();
  }, []);

  // 목록 불러오기
  const fetchQnaList = () => {
    axios.get('http://localhost:8080/api/v1/qna')
      .then(response => {
        setQnaList(response.data);
      })
      .catch(error => {
        console.error('Error fetching Q&A list:', error);
      });
  };

  // 답변하기
  const handleReply = (qna) => {
    setSelectedQna(qna);
  
    axios.get(`http://localhost:8080/api/v1/qna/${qna.qnaId}`)
      .then(response => {
        const qnaDetails = response.data;
        Swal.fire({
          title: '답변 작성',
          html: `
            <div>
              <p><strong>답변 번호:</strong> ${qnaDetails.qnaId}</p>
              <p><strong>회원명:</strong> ${qnaDetails.writerName}</p>
              <p><strong>제목:</strong> ${qnaDetails.title}</p>
              <p><strong>내용:</strong> ${qnaDetails.content}</p>
              <p><strong>작성일:</strong> ${formatTime(qnaDetails.createdDate)}</p>
              <textarea id="replyContent" rows="4" cols="50" placeholder="답변을 작성해주세요" class="swal2-textarea"></textarea>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '답변 완료',
          cancelButtonText: '취소',
          focusConfirm: false,
          preConfirm: () => {
            const reply = document.getElementById('replyContent').value;
            if (!reply) {
              Swal.showValidationMessage('답변을 작성해주세요');
            }
            return reply;
          }
        }).then((result) => {
          if (result.isConfirmed) {
            handleReplySubmit(result.value);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching Q&A details:', error);
        Swal.fire({
          title: 'Q&A 항목 정보를 가져오는 중 오류가 발생하였습니다',
          icon: 'error',
          confirmButtonText: '확인'
        });
      });
  };
  
  // 답변 제출
  const handleReplySubmit = (reply) => {
    if (!selectedQna || !selectedQna.qnaId) {
      console.error('Invalid qna object or qnaId is null/undefined:', selectedQna);
      return;
    }
  
    axios.patch(`http://localhost:8080/api/v1/qna/${selectedQna.qnaId}`, { 
      reply, 
      status: 'COMPLETED',
      title: selectedQna.title, // Q&A 제목 보존
      content: selectedQna.content, // Q&A 내용 보존
    })
      .then(response => {
        fetchQnaList(); // 답변 성공 후 목록을 다시 불러옴
        Swal.fire({
          title: '답변이 성공적으로 전송되었습니다',
          icon: 'success',
          confirmButtonText: '확인'
        });
      })
      .catch(error => {
        console.error('Error replying to Q&A:', error);
        Swal.fire({
          title: '답변 전송 중 오류가 발생하였습니다',
          icon: 'error',
          confirmButtonText: '확인'
        });
      });
  };
  

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
      <h1 className="text-2xl font-bold mb-7">1:1 문의 내역 관리</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원명</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변 여부</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변하기</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {qnaList.map((qna, index) => (
            <tr key={qna.qnaId}>
              <td className="px-6 py-4 whitespace-nowrap">{qna.qnaId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{qna.memberId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{qna.writerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{qna.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatTime(qna.createdDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{qna.status === 'WAITING' ? '미처리' : '답변완료'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {qna.status === 'WAITING' && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleReply(qna)}
                  >
                    답변하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSManagement;