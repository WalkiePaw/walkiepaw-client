// 회원 목록 관리
import React, { useState, useEffect } from 'react';
// axios 임포트
import axios from 'axios';
// 팝업 모달창
import Swal from 'sweetalert2';
// styled-component 적용
import styled from 'styled-components';
// 회원가입일
import formatTime from '../util/formatTime'

// 스타일드 컴포넌트 정의
const StyledSelect = styled.select`
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s;

  &:focus {
    border-color: #48bb78;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
`;

const StyledInputContainer = styled.div`
  position: relative;
  margin-right: 10px;
`;

const StyledInputLabel = styled.label`
  position: absolute;
  left: 10px;
  top: ${({ hovered }) => (hovered ? '-20px' : '50%')};
  transform: ${({ hovered }) => (hovered ? 'translateY(0)' : 'translateY(-50%)')};
  transition: top 0.3s, transform 0.3s;
  background-color: white;
  padding: 0 5px;
  font-size: ${({ hovered }) => (hovered ? '12px' : 'inherit')};
  color: #999;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  transition: all 0.3s;

  &:focus {
    border-bottom-color: #48bb78;
    box-shadow: 0 1px 0 0 #48bb78;
    outline: none;
  }

  &:hover {
    border-bottom-color: #48bb78;
  }

  &::placeholder {
    color: transparent; /* placeholder 숨기기 */
  }

  &:focus ~ ${StyledInputLabel}, &:not(:placeholder-shown) ~ ${StyledInputLabel} {
    top: -20px;
    transform: translateY(0);
    font-size: 12px;
    color: #48bb78;
  }
`;

// 회원 목록 표 css
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f8f8f8;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInputHovered, setInputHovered] = useState(false);

  const handleInputHover = () => {
    setInputHovered(true);
  };

  const handleInputLeave = () => {
    setInputHovered(false);
  };

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

    // 필터링된 회원 목록을 반환하는 함수: 이름, 닉네임, 누적 신고 횟수, 이메일로 검색 가능
    const filteredMembers = members.filter((member) => {
      if (searchField === 'name') {
        return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === 'nickname') {
        return member.nickname.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchField === 'reportedCnt') {
        // 검색어가 숫자인지 확인
        const searchTermLower = searchTerm.toLowerCase();
        if (!isNaN(searchTermLower)) {
          // 신고 횟수가 검색어보다 크거나 같은 경우 필터링
          return member.reportedCnt >= parseInt(searchTermLower, 10);
        }
        return false;
      } else if (searchField === 'email') {
        return member.email.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">회원 목록 관리</h2>
      <div className="mb-4 flex">
        <StyledSelect
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="name">이름</option>
              <option value="nickname">닉네임</option>
              <option value="reportedCnt">신고 횟수</option>
              <option value="email">이메일</option>
            </StyledSelect>
            <StyledInputContainer>
              <StyledInput
                type="text"
                placeholder=" "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onMouseEnter={handleInputHover}
                onMouseLeave={handleInputLeave}
              />
              <StyledInputLabel hovered={isInputHovered}>검색어 입력</StyledInputLabel>
            </StyledInputContainer>
          </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white border border-gray-200">
          <thead>
            <Tr>
              <Th>번호</Th>
              <Th>Email</Th>
              <Th>이름</Th>
              <Th>닉네임</Th>
              <Th>가입일자</Th>
              <Th>누적 신고횟수</Th>
              <Th>상태</Th>
            </Tr>
          </thead>
          <tbody>
          {filteredMembers.map((member, index) => (
            <Tr key={member.id}>
              <Td>{index + 1}</Td>
              <Td>{member.email}</Td>
              <Td>{member.name}</Td>
              <Td>{member.nickname}</Td>
              <Td>{formatTime(member.createdDate)}</Td>
              <Td style={{ textAlign: 'center' }}>{member.reportedCnt}</Td>
              <Td>{statusMap[member.status]}</Td>
            </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MemberList;
