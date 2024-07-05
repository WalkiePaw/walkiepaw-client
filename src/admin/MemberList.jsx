// g회원 목록 관리
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // API 호출 함수 정의
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/members'); // API 엔드포인트 URL 입력
        setMembers(response.data); // 데이터 설정
      } catch (error) {
        console.error('Error fetching members:', error);
        Swal.fire({
          icon: 'error',
          title: '회원 목록 가져오기 실패',
          text: '회원 목록을 가져오는 중 오류가 발생했습니다.',
        });
      }
    };

    fetchMembers(); // 함수 호출

  }, []); // useEffect는 한 번만 실행되어야 하므로 빈 배열을 두 번째 인자로 전달

  // 상태에 대한 매핑 객체 정의
  const statusMap = {
    GENERAL: "일반",
    WITHDRAWN: "탈퇴",
    BANNED: "제재 또는 정지된 회원",
    INACTIVE: "휴면 상태"
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">회원 목록 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">번호</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">이름</th>
              <th className="px-4 py-2 border-b">닉네임</th>
              <th className="px-4 py-2 border-b">가입일자</th>
              <th className="px-4 py-2 border-b">신고횟수</th>
              <th className="px-4 py-2 border-b">상태</th>
            </tr>
          </thead>
          <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{member.email}</td>
              <td className="px-4 py-2 border-b">{member.name}</td>
              <td className="px-4 py-2 border-b">{member.nickname}</td>
              <td className="px-4 py-2 border-b">{member.createdDate}</td>
              <td className="px-4 py-2 border-b">{member.reportedCnt}</td>
              <td className="px-4 py-2 border-b">{statusMap[member.status]}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full bg-white border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">상태 선택</option>
                  <option value="GENERAL">일반</option>
                  <option value="WITHDRAWN">탈퇴</option>
                  <option value="BANNED">제재 또는 정지된 회원</option>
                  <option value="INACTIVE">휴면 상태</option>
                </select>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
