// 내 거래 내역 보기
// src/pages/MyTransaction.jsx

import { useState } from "react";

const MyTransaction = () => {
  const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정

  // 게시글 데이터 예시
  const [posts, setPosts] = useState([
    { id: 1, title: "산책", member: "상대 회원 닉네임", review: "작성 완료", createdDate: "2024-06-21 10:00" },
    { id: 2, title: "알바", member: "상대 회원 닉네임", review: "리뷰 남기기", createdDate: "2024-06-20 15:30" },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 각 탭에 따른 게시글 설정
    if (tab === "walk") {
      setPosts([
        { id: 1, title: "산책", member: "상대 회원 닉네임", review: "작성 완료", createdDate: "2024-06-21 10:00" },
      ]);
    } else if (tab === "partTimeJob") {
      setPosts([
        { id: 2, title: "알바", member: "상대 회원 닉네임", review: "리뷰 남기기", createdDate: "2024-06-20 15:30" },
      ]);
    }
  };

  // 날짜 설정
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} / ${hours}:${minutes}`;
};

  return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-5 mr-4">내 거래 내역</h1>
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
          <div className="w-full overflow-hidden rounded-lg border border-gray-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거래한 회원
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  리뷰 작성
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일/시간
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.member}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.review}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(post.createdDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default MyTransaction;


// 추가될 부분: 리뷰 상태에 따라 리뷰 남기기 버튼 필요
