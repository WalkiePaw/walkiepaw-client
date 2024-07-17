// Introduction 대시보드(프로파일) 홈 화면

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";
// 게시글 목록 받아오기
import PostList from './PostList'; 
// 리뷰 목록 받아오기
import DashboardReview from './DashboardReview';
import styled from 'styled-components';
// font-awesome: scroll to top 버튼
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';

const TopButtonContainer = styled.div`
  position: fixed;
  bottom: 120px;
  right: 5%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopButton = styled.button`
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Introduction = ( {nickname} ) => {
  const [memberData, setMemberData] = useState(null);
  const [postCount, setPostCount] = useState(); //  보여줄 초기 게시글 개수
  const [reviewCount, setReviewCount] = useState(); // 보여줄 초기 리뷰 개수
  const [activeTab, setActiveTab] = useState("JOB_SEARCH");
  useEffect(() => {
    console.log("Introduction nickname:", nickname); // 디버깅용 로그

    if (nickname) {
      axios.get(`http://localhost:8080/api/v1/members/${encodeURIComponent(nickname)}/dashboard`)
        .then(response => {
          setMemberData(response.data);
        })
        .catch((error) => {
          console.error("회원 정보를 가져오던 도중 오류 발생:", error);
        });
    } else {
      console.error('닉네임을 찾을 수 없음');
    }
  }, [nickname]);

  // 상단으로 올라가기
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='flex-1 p-4'>
      {/* 리뷰 목록: 최신순으로 정렬할 예정 */}
      <DashboardReview activeTab={activeTab} reviewCount={reviewCount} />
      <div className="border-t-2 mt-5 mb-5 border-gray-300" />
      {/* 게시글 목록: 최신순으로 정렬할 예정 */}
      <PostList activeTab={activeTab} postCount={postCount} />
      <TopButtonContainer>
        <TopButton onClick={scrollToTop}>
          <FontAwesomeIcon icon={faCircleArrowUp} />
        </TopButton>
      </TopButtonContainer>
    </div>
  );
};

export default Introduction;
