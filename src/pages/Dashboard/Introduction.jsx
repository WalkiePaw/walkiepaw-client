// src/pages/Dashboard/Introduction.jsx 홈 화면

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";
// 게시글 목록 받아오기
import PostList from './PostList'; 
// 리뷰 목록 받아오기
import Review from '../../components/Review';
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

const Introduction = () => {
  const [memberData, setMemberData] = useState(null);
  const [postCount, setPostCount] = useState(); //  보여줄 초기 게시글 개수
  const [reviewCount, setReviewCount] = useState(); // 보여줄 초기 리뷰 개수
  const [activeTab, setActiveTab] = useState("JOB_SEARCH");

  useEffect(() => {
    const memberId = 1; 

    if (memberId) {
      axios.get(`http://localhost:8080/api/v1/members/${memberId}`)
        .then(response => {
          setMemberData(response.data); // 사용자 데이터를 state에 저장
        })
        .catch(error => {
          console.error('회원 정보를 가져오던 도중 오류 발생:', error);
        });
    } else {
      console.error('로컬 저장소에서 회원 아이디를 찾을 수 없음');
    }
  }, []);

  // 게시글 더보기
  const loadMorePosts = () => {
    setPostCount(prevCount => prevCount + 2); // 2개씩 더보기 추가
  };

  // 리뷰 더보기
  const loadMoreReviews = () => {
    setReviewCount(prevCount => prevCount + 2); // 2개씩 더보기 추가
  };

  // 상단으로 올라가기
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div className='flex-1 p-4'>
      <h1 className="text-3xl font-bold mt-3 mb-5">소개</h1>
      <p className="p-4 bg-white rounded-lg border border-gray-300">{memberData ? memberData.profile : ''}</p>
      <div className="border-t-2 mt-4 mb-5 border-gray-300" />
      {/* 리뷰 목록: 최신순으로 정렬할 예정 */}
      <Review activeTab={activeTab} reviewCount={reviewCount} />
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
