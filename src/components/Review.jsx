// 받은 리뷰 목록
import React from 'react';
import { useState } from "react";
import pawpaw from './../assets/pawpaw.png'; 

const Review = () => {
  const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정: 산책, 알바

  // 리뷰 데이터 
  // const [] = "useState()"
  
  // 게시글 데이터 예시
  const [reviews, setReviews] = useState([
    {
      id: 1,
      score: 5,
      member: "산책왕",
      content: "산책 리뷰 내용",
      date: "2024-06-21",
    },
    {
      id: 2,
      score: 5,
      member: "감성탐방러",
      content: "알바 리뷰 내용",
      date: "2024-06-20",
    },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 각 탭에 따른 게시글 설정
    if (tab === "walk") {
      setReviews([
        {
          id: 1,
          score: 5,
          member: "산책왕",
          content: "산책 리뷰 내용",
          date: "2024-06-21",
        },
      ]);
    } else if (tab === "partTimeJob") {
      setReviews([
        {
          id: 2,
          score: 5,
          member: "감성탐방러",
          content: "알바 리뷰 내용",
          date: "2024-06-20",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">받은 리뷰 내역</h1>
      <div className="flex mb-3 dlomb-4">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === "walk"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("walk")}
        >
          산책
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === "partTimeJob"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("partTimeJob")}
        >
          알바
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        {reviews.map((post) => (
          <div key={post.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center mb-2">
            <span className="font-medium">평점:</span>
              {Array(post.score).fill().map((_, i) => (
                <img src={pawpaw} alt="star" key={i} className="inline-block w-8 h-8" />
              ))}
            </div>
            <div className="mb-2">
              <span className="font-medium">거래한 회원:</span> {post.member}
            </div>
            <div className="mb-2">
              <span className="font-medium">내용:</span> {post.content}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">거래일:</span> {post.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;