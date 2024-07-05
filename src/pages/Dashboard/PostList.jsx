// 게시글 목록
import React from 'react';
import { useState, useEffect } from "react";
// sweetalert2 임포트
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// axios 임포트
import axios from 'axios';

const PostList = () => {

const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정
// 게시글 데이터 가져오기
const [posts, setPosts] = useState([]);
const MySwal = withReactContent(Swal);
const id= 1;
const memberId = 1;

useEffect(() => {
  fetchPosts("JOB_SEARCH"); // 기본 탭 설정을 "구직"으로 변경
}, []);

const fetchPosts = async (category) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/boards/mypage/${memberId}/${category}`);
    setPosts(response.data);
  } catch (error) {
    console.error("Failed to fetch posts", error);
    MySwal.fire({
      title: "Error",
      text: "게시글 불러오기 실패",
      icon: "error",
      confirmButtonText: "OK"
    });
  }
};

const handleTabClick = (tab) => {
  setActiveTab(tab);
  fetchPosts(tab); // 탭에 따른 게시글 데이터 가져오기
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
      <h1 className="text-3xl font-bold mb-5 mr-4">작성한 게시글 내역(n)</h1>
      <div className="flex mb-3 dlomb-4">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === "JOB_SEARCH"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_SEARCH")} // 백엔드와 동일한 탭 값으로 설정: 구직
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === "JOB_OPENING"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_OPENING")} // 백엔드와 동일한 탭 값으로 설정: 구인
        >
          알바 구직글
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                번호
              </th>
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.boardId}>
                <td className="px-6 py-4 whitespace-nowrap">{post.boardId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatTime(post.createdDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostList;