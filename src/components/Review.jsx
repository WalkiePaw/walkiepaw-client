// 받은 리뷰 목록
import React from 'react';
import { useState, useEffect } from "react";
import pawpaw from './../assets/pawpaw.png'; 
// axios 임포트
import axios from 'axios';

const Review = () => {
  const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정: 산책, 알바
  const [allReviews, setAllReviews] = useState([]); // 모든 리뷰 데이터를 저장
  // const [filteredReviews, setFilteredReviews] = useState([]); // 필터링된 리뷰 데이터를 저장

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // filterReviews(tab);
  };

  // 모든 리뷰 데이터 가져오기
  const fetchReviews = () => {
    axios.get('http://localhost:8080/api/v1/reviews/1/reviews') // 전체 리뷰 엔드포인트 호출
      .then(response => {
        setAllReviews(response.data);
        // filterReviews(activeTab, response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the reviews!", error);
      });
  };

  // 리뷰 데이터 필터링
  // const filterReviews = (tab, reviews = allReviews) => {
  //   if (tab === "walk") {
  //     setFilteredReviews(reviews.filter(review => review.category === 'walk'));
  //   } else if (tab === "partTimeJob") {
  //     setFilteredReviews(reviews.filter(review => review.category === 'partTimeJob'));
  //   }
  // };

  // 컴포넌트 마운트 시 리뷰 데이터 가져오기
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">받은 리뷰 내역</h1>
      <div className="flex mb-3">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${activeTab === "walk" ? "bg-[#43312A] text-white" : "bg-[#E8C5A5] text-gray-800"}`}
          onClick={() => handleTabClick("walk")}
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${activeTab === "partTimeJob" ? "bg-[#43312A] text-white" : "bg-[#E8C5A5] text-gray-800"}`}
          onClick={() => handleTabClick("partTimeJob")}
        >
          알바 구직글
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        {allReviews.map((review) => (
          <div key={review.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center mb-2">
              <span className="font-medium">평점:</span>
              {Array(review.point).fill().map((_, i) => (
                <img src={pawpaw} alt="star" key={i} className="inline-block w-8 h-8" />
              ))}
            </div>
            <div className="mb-2">
              <span className="font-medium">거래한 회원:</span> {review.memberName}
            </div>
            <div className="mb-2">
              <span className="font-medium">내용:</span> {review.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
