// 고객센터 문의 내용, 답변

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";
// 팝업창으로 문의, 관리자 답변 내용 보기
import Swal from 'sweetalert2';

const QnaList = () => {
  const [qnaList, setQnaList] = useState([]);

  useEffect(() => {
    const fetchQnaList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/qna');
        setQnaList(response.data);
      } catch (error) {
        console.error('Error fetching QnA list', error);
      }
    };

    fetchQnaList();
  }, []);

  const handleViewReply = async (qnaId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/qna/${qnaId}`);
      const qna = response.data;
      Swal.fire({
        title: '답변 상세 정보',
        html:
            `
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="mb-3"><strong>문의 제목:</strong> ${qna.title}</p>
              <div class="border-t border-gray-200 pt-4">
                <p class="mb-2"><strong>문의 내용:</strong></p>
                <textarea class="w-full p-2 rounded resize-none" rows="3" readonly>${qna.content}</textarea>
              </div>
              <div class="border-t border-gray-200 pt-4">
                <p class="mb-2"><strong>관리자 답변:</strong></p>
                <textarea class="w-full p-2 rounded resize-none" rows="3" readonly>${qna.reply}</textarea>
              </div>
            </div>
            `
          ,
        showCloseButton: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error fetching QnA details', error);
      Swal.fire({
        title: '오류',
        text: '답변 상세 정보를 불러오는 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">내 문의 내역 💬</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-600">
              제목
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-600">
              답변여부
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-600">
              작성일
            </th>
          </tr>
        </thead>
        <tbody>
          {qnaList.map((qna) => (
            <tr key={qna.qnaId} onClick={() => handleViewReply(qna.qnaId)} style={{ cursor: 'pointer' }}>
              <td className="py-2 px-4 border-b border-gray-200">{qna.title}</td>
              <td className="py-2 px-4 border-b border-gray-200">{qna.status === 'COMPLETED' ? '답변 완료' : '대기 중'}</td>
              <td className="py-2 px-4 border-b border-gray-200">{new Date(qna.createdDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QnaList;
