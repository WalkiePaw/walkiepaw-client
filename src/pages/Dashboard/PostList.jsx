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
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인
  const pageSize = 4; // 한 번에 불러올 게시글 수
  const MySwal = withReactContent(Swal);
  const memberId = 1;

  const CATEGORY_JOB_SEARCH = 'JOB_SEARCH';
  const CATEGORY_JOB_OPENING = 'JOB_OPENING';

  useEffect(() => {
    setPage(0); // 탭 변경 시 페이지 번호 초기화
    fetchPosts(activeTab, 0); // 초기 데이터 로드
  }, [activeTab]);

  useEffect(() => {
    if (page > 0) {
      fetchPosts(activeTab, page); // 페이지 번호가 변경될 때 추가 데이터 로드
    }
  }, [page]);

  const fetchPosts = async (category, pageNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/boards/mypage/${memberId}/${category}?page=${pageNumber}&size=${pageSize}`
    );
    const newPosts = response.data.content;
    console.log(response.data);
    if (pageNumber === 0) {
      setPosts(newPosts); // 첫 페이지일 경우 새로운 데이터로 교체
    } else {
      setPosts(prevPosts => [...prevPosts, ...newPosts]); // 다음 페이지일 경우 기존 데이터에 추가
    }
    setHasMore(response.data.last === false); // 더 불러올 데이터가 있는지 여부 확인
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
      setPage(0); // 탭 변경 시 페이지 번호 초기화
    }
  };

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1); // 페이지 번호 증가
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
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
      ) : (
        <p className="text-lg font-medium text-gray-500">작성한 게시글이 없습니다.</p>
      )}
    </div>
  );
};

export default PostList;
