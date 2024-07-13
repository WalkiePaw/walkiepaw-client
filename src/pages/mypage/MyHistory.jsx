// 내 작성글 보기

import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
// sweetalert2 임포트
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// fontawesome 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
// axios 임포트
import axios from 'axios';
// 게시글 작성일
import formatTime from '../../util/formatTime';

const MyHistory = () => {
  const [activeTab, setActiveTab] = useState('JOB_OPENING');
  const [posts, setPosts] = useState([]);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { id } = useOutletContext();

  useEffect(() => {
    if (id) { // id가 존재할 때만 fetchPosts 호출
      fetchPosts(activeTab);
    }
  }, [id, activeTab]); // id와 activeTab이 변경될 때마다 useEffect 실행

  const fetchPosts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/boards/mypage/${id}/${category}`);
      setPosts(response.data.content);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchPosts(tab); // 탭에 따른 게시글 데이터 가져오기
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: '삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/v1/boards/${id}`);
          setPosts(posts.filter((post) => post.id !== id));
          MySwal.fire({
            title: '삭제 완료',
            icon: 'success',
            confirmButtonText: '확인',
          });
        } catch (error) {
          console.error('Failed to delete post', error);
          MySwal.fire({
            title: 'Error',
            text: '게시글 삭제 실패',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const handleRowClick = (boardId) => {
    navigate(`/post/${boardId}`);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">작성글 내역</h1>
      <div className="flex mb-3 dlomb-4">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === 'JOB_SEARCH' ? 'bg-[#43312A] text-white' : 'bg-[#E8C5A5] text-gray-800'
          }`}
          onClick={() => handleTabClick('JOB_SEARCH')} // 백엔드와 동일한 탭 값으로 설정: 구직
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === 'JOB_OPENING' ? 'bg-[#43312A] text-white' : 'bg-[#E8C5A5] text-gray-800'
          }`}
          onClick={() => handleTabClick('JOB_OPENING')} // 백엔드와 동일한 탭 값으로 설정: 구인
        >
          알바 구직글
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
      {posts.length > 0 ? (
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                삭제
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(posts) && posts.map((post) => (
              <tr key={post.boardId} onClick={() => handleRowClick(post.boardId)} className="cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">{post.boardId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatTime(post.createdDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="w-12 h-12 flex justify-center items-center text-white rounded-md bg-orange-500 hover:bg-orange-500"
                    onClick={() => handleDelete(post.boardId)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            내 작성글이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHistory;
