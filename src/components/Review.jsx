// 받은 리뷰 목록
import React, { useState, useEffect } from "react";
import pawpaw from "./../assets/pawpaw.png";
// axios 임포트
import axios from "axios";

const Review = () => {
  const [activeTab, setActiveTab] = useState("JOB_OPENING"); // 기본 선택 탭 설정: 산책, 알바
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 모든 리뷰 데이터 가져오기
  const fetchReviews = () => {
    axios
      .get(`http://localhost:8080/api/v1/reviews/1/reviewee`, {
        params: {
          page: 0,
          category: activeTab
        }
      })
      .then((response) => {
        const reviewsData = response.data.content;
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        } else {
          console.error('서버에서 올바른 형식의 리뷰 데이터를 반환하지 않았습니다.');
        }
      })
      .catch((error) => {
        console.error('리뷰 목록을 불러오는 중 오류가 발생했습니다:', error);
      });
  };

  // 컴포넌트 마운트 시 리뷰 데이터 가져오기
  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">받은 리뷰 내역</h1>
      <div className="flex mb-3">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === "JOB_OPENING"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_OPENING")}
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === "JOB_SEARCH"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_SEARCH")}
        >
          알바 구직글
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-300"
          >
            <div className="flex items-center mb-2">
              <span className="font-medium">평점:</span>
              {Array(review.point)
                .fill()
                .map((_, i) => (
                  <img
                    src={pawpaw}
                    alt="star"
                    key={i}
                    className="inline-block w-8 h-8"
                  />
                ))}
            </div>
            <div className="mb-2">
              <span className="font-medium">거래한 회원:</span>{" "}
              {review.memberName}
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