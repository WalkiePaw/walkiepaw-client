// 게시글 목록
import React, { useState, useEffect } from 'react';
// sweetalert2 임포트
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// axios 임포트
import axios from 'axios';


const PostList = ( {postCount} ) => {
  const [activeTab, setActiveTab] = useState('JOB_SEARCH');
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(2); // 처음 보일 게시글 수
  const [showNoMorePosts, setShowNoMorePosts] = useState(false);
  const pageSize = 3; // 한 번에 불러올 게시글 수
  const MySwal = withReactContent(Swal);
  const memberId = 1;

  const CATEGORY_JOB_SEARCH = 'JOB_SEARCH';
  const CATEGORY_JOB_OPENING = 'JOB_OPENING';

  useEffect(() => {
    setVisiblePosts(5); // 탭 변경 시 보이는 게시글 수 초기화
    setShowNoMorePosts(false);
    fetchPosts(activeTab);
  }, [activeTab]);

  const fetchPosts = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/boards/mypage/${memberId}/${category}?page=0&size=100`
      );
      const newPosts = response.data.content;
      setPosts(newPosts);
      setShowNoMorePosts(newPosts.length <= visiblePosts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      MySwal.fire({
        title: 'Error',
        text: '게시글 불러오기 실패',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setPosts([]);
      setVisiblePosts(5);
      setShowNoMorePosts(false);
    }
  };

  // 페이지 더보기
  const loadMorePosts = () => {
    const newVisiblePosts = visiblePosts + 3;
    setVisiblePosts(newVisiblePosts);
    if (newVisiblePosts >= posts.length) {
      setShowNoMorePosts(true);
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
      <h1 className="text-3xl font-bold mb-5 mr-4">작성한 게시글 내역</h1>
      <div className="flex mb-3">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === 'JOB_SEARCH' ? 'bg-[#43312A] text-white' : 'bg-[#E8C5A5] text-gray-800'
          }`}
          onClick={() => handleTabChange(CATEGORY_JOB_SEARCH)}
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === 'JOB_OPENING' ? 'bg-[#43312A] text-white' : 'bg-[#E8C5A5] text-gray-800'
          }`}
          onClick={() => handleTabChange(CATEGORY_JOB_OPENING)}
        >
          알바 구직글
        </button>
      </div>
      {posts.length > 0 ? (
        <div className="w-full overflow-hidden rounded-lg border border-gray-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일/시간</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.slice(0, visiblePosts).map((post) => (
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
      ) : (
        <p className="text-lg font-medium text-gray-500">작성한 게시글이 없습니다.</p>
      )}
      {!showNoMorePosts && posts.length > visiblePosts && (
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-[#E8C5A5] text-gray-800 rounded-md"
            onClick={loadMorePosts}
          >
            더보기
          </button>
        </div>
      )}
      {showNoMorePosts && posts.length > 0 && (
        <p className="mt-2 text-lg font-medium text-gray-500">더 이상 게시글이 없습니다.</p>
      )}
    </div>
  );
};
export default PostList;
