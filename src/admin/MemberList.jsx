// g회원 목록 관리
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // API 호출 함수 정의
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/members'); 
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

  // 회원 가입일 설정
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    // 필터링된 회원 목록을 반환하는 함수: 이름, 닉네임, 누적 신고 횟수, 이메일로 검색 가능
    const filteredMembers = members.filter((member) => {
      if (searchField === 'name') {
        return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === 'nickname') {
        return member.nickname.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === 'reportedCnt') {
        return member.reportedCnt.toString().includes(searchTerm);
      } else if (searchField === 'email') {
        return member.email.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">회원 목록 관리</h2>
      <div className="mb-4 flex">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="mr-2 p-2 border border-gray-300 rounded"
        >
          <option value="name">이름</option>
          <option value="nickname">닉네임</option>
          <option value="reportedCnt">신고 횟수</option>
          <option value="email">이메일</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">번호</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">이름</th>
              <th className="px-4 py-2 border-b">닉네임</th>
              <th className="px-4 py-2 border-b">가입일자</th>
              <th className="px-4 py-2 border-b">누적 신고횟수</th>
              <th className="px-4 py-2 border-b">상태</th>
            </tr>
          </thead>
          <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={member.id}>
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{member.email}</td>
              <td className="px-4 py-2 border-b">{member.name}</td>
              <td className="px-4 py-2 border-b">{member.nickname}</td>
              <td className="px-4 py-2 border-b">{formatTime(member.createdDate)}</td>
              <td className="px-4 py-2 border-b">{member.reportedCnt}</td>
              <td className="px-4 py-2 border-b">{statusMap[member.status]}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
