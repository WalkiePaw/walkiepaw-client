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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

// 페이지 버튼 스타일
const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: ${props => props.active ? '#48bb78' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  
  &:hover {
    background-color: #48bb78;
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// ... (기존의 스타일드 컴포넌트 코드는 그대로 유지)

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    nickname: '',
    email: '',
    reportedCnt: ''
  });
  const [isInputHovered, setInputHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const handleInputHover = () => setInputHovered(true);
  const handleInputLeave = () => setInputHovered(false);

  useEffect(() => {
    fetchMembers();
  }, [currentPage, searchParams]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://57.180.244.228:8000/api/v1/members/search', {
        params: {
          ...searchParams,
          page: currentPage,
          size: pageSize,
          sort: 'id,desc' // 예시로 id 기준 내림차순 정렬
        }
      });
      setMembers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching members:', error);
      Swal.fire({
        icon: 'error',
        title: '회원 목록 가져오기 실패',
        text: '회원 목록을 가져오는 중 오류가 발생했습니다.',
      });
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const statusMap = {
    GENERAL: "일반",
    WITHDRAWN: "탈퇴",
    BANNED: "제재 또는 정지된 회원",
    INACTIVE: "휴면 상태"
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">회원 목록 관리</h2>
      <div className="mb-4 flex flex-wrap">
        <StyledInputContainer>
          <StyledInput
            type="text"
            placeholder=" "
            value={searchParams.name}
            onChange={(e) => handleSearchChange('name', e.target.value)}
            onMouseEnter={handleInputHover}
            onMouseLeave={handleInputLeave}
          />
          <StyledInputLabel hovered={isInputHovered}>이름</StyledInputLabel>
        </StyledInputContainer>
        <StyledInputContainer>
          <StyledInput
            type="text"
            placeholder=" "
            value={searchParams.nickname}
            onChange={(e) => handleSearchChange('nickname', e.target.value)}
            onMouseEnter={handleInputHover}
            onMouseLeave={handleInputLeave}
          />
          <StyledInputLabel hovered={isInputHovered}>닉네임</StyledInputLabel>
        </StyledInputContainer>
        <StyledInputContainer>
          <StyledInput
            type="text"
            placeholder=" "
            value={searchParams.email}
            onChange={(e) => handleSearchChange('email', e.target.value)}
            onMouseEnter={handleInputHover}
            onMouseLeave={handleInputLeave}
          />
          <StyledInputLabel hovered={isInputHovered}>이메일</StyledInputLabel>
        </StyledInputContainer>
        <StyledInputContainer>
          <StyledInput
            type="number"
            placeholder=" "
            value={searchParams.reportedCnt}
            onChange={(e) => handleSearchChange('reportedCnt', e.target.value)}
            onMouseEnter={handleInputHover}
            onMouseLeave={handleInputLeave}
          />
          <StyledInputLabel hovered={isInputHovered}>신고 횟수</StyledInputLabel>
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
          {members.map((member, index) => (
            <Tr key={member.id}>
              <Td>{currentPage * pageSize + index + 1}</Td>
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
      <PaginationContainer>
        {[...Array(totalPages).keys()].map((page) => (
          <PageButton
            key={page}
            onClick={() => handlePageChange(page)}
            active={currentPage === page}
          >
            {page + 1}
          </PageButton>
        ))}
      </PaginationContainer>
    </div>
  );
};

export default MemberList;
