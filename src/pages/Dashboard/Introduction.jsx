// src/pages/Dashboard/Introduction.jsx 홈 화면

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";
// 게시글 목록 받아오기
import PostList from './PostList'; 
// 리뷰 목록 받아오기
import Review from './Review';


const Introduction = () => {
  const [memberData, setMemberData] = useState(null);
  const [postCount, setPostCount] = useState(1); //  보여줄 게시글 개수
  const [reviewCount, setReviewCount] = useState(1); // 보여줄 리뷰 개수
  const [activeTab, setActiveTab] = useState("JOB_SEARCH");

  useEffect(() => {
    const memberId = 1; 
    // const memberId = localStorage.getItem('userId'); // 로그인한 사용자의 ID를 가져옴

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
    setPostCount(prevCount => prevCount + 1); // Increase the number of posts to display
  };

  const loadMoreReviews = () => {
    setReviewCount(prevCount => prevCount + 1); // Increase the number of posts to display
  };

  // 리뷰 더보기
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mt-3 mb-5">소개</h1>
      <p className="p-4 bg-white rounded-lg border border-gray-300">{memberData ? memberData.profile : ''}</p>
      <div className="border-t-2 mt-4 mb-5 border-gray-300" />

      {/* 리뷰 목록: 최신순으로 정렬할 예정 */}
      <Review activeTab={activeTab} reviewCount={reviewCount} />
      <div>
        <button className="px-8 py-2 rounded-md mt-5 mb-5 border border-black " onClick={loadMoreReviews}>
          더보기
        </button>
      </div>
      <div className="border-t-2 mt-5 mb-5 border-gray-300" />

      {/* 게시글 목록: 최신순으로 정렬할 예정 */}
      <PostList activeTab={activeTab} postCount={postCount} />
      
      <div>
        <button className="px-8 py-2 rounded-md mt-5 border border-black " onClick={loadMorePosts}>
          더보기
        </button>
      </div>



      <button className="mt-5" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
};

export default Introduction;
