// src/pages/Dashboard/Introduction.jsx

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from "axios";


const Introduction = () => {
  const [memberData, setMemberData] = useState(null);

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
      console.error('No user ID found in local storage.');
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">소개</h1>
      <p className="p-4 bg-white rounded-lg border border-gray-300">{memberData ? memberData.profile : ''}</p>
      <div className="border-t-2 mt-4 mb-5 border-gray-300">
        <h1 className="text-3xl font-bold mt-4 mb-3">리뷰</h1>
      </div>
      <div className="border-t-2 mt-4 border-gray-300">
        <h1 className="text-3xl font-bold mt-4 mb-5">게시글</h1>
      </div>

      <button className="top-button" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
};

export default Introduction;
