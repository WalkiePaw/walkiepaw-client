// 게시글 목록
import React from 'react';
import { useState } from "react";

const PostList = () => {

const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정

  // 게시글 데이터 예시
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "산책",
      content: "산책 게시글 내용",
      date: "2024-06-21 10:00-11:00",
      price: "10,000원",
    },
    {
      id: 2,
      title: "알바",
      content: "알바 게시글 내용",
      date: "2024-06-20 15:30-18:00",
      price: "20,000원"
    },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 각 탭에 따른 게시글 설정
    if (tab === "walk") {
      setPosts([
        {
          id: 1,
          title: "산책",
          content: "산책 게시글 내용",
          date: "2024-06-21 10:00-11:00",
          price: "10,000원",
        },
      ]);
    } else if (tab === "partTimeJob") {
      setPosts([
        {
          id: 2,
          title: "알바",
          content: "알바 게시글 내용",
          date: "2024-06-20 15:30-18:00",
          price: "20,000원",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">작성글 내역</h1>
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                제목
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                내용
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                작성일/시간
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                가격
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostList;