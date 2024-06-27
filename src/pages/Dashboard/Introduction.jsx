// src/pages/Dashboard/Introduction.jsx

import React from "react";

const Introduction = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">소개</h1>
      <p className="p-4 bg-white rounded-lg border border-gray-300">하루 2시간 산책은 거뜬한 체력을 가지고 있습니다. 대형견, 소형견 등 가리지 않고 받습니다.</p>
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
