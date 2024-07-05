// 고객센터 문의 내용, 답변

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";

const QnaList = () => {
  const [qnaList, setQnaList] = useState([]);

  useEffect(() => {
    // 백엔드에서 QnA 리스트를 가져옴
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
            <tr key={qna.id}>
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
