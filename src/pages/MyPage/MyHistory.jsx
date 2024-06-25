// 내 작성글 보기
// src/pages/MyHistory.jsx

import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const MyHistory = () => {
  const [activeTab, setActiveTab] = useState("walk"); // 기본 선택 탭 설정
  const MySwal = withReactContent(Swal);

  // 게시글 데이터 예시
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "산책",
      content: "산책 게시글 내용",
      date: "2024-06-21 10:00",
    },
    {
      id: 2,
      title: "알바",
      content: "알바 게시글 내용",
      date: "2024-06-20 15:30",
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
          date: "2024-06-21 10:00",
        },
      ]);
    } else if (tab === "partTimeJob") {
      setPosts([
        {
          id: 2,
          title: "알바",
          content: "알바 게시글 내용",
          date: "2024-06-20 15:30",
        },
      ]);
    }
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        setPosts(posts.filter((post) => post.id !== id));
        MySwal.fire({
          title: "삭제 완료",
          icon: "success",
          confirmButtonText: "확인",
        });
      }
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4 mr-4">작성글 내역</h1>
      <div className="flex mb-4">
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
                삭제
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="w-12 h-12 flex justify-center items-center text-white rounded-md bg-orange-500 hover:bg-orange-500"
                    onClick={() => handleDelete(post.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHistory;
