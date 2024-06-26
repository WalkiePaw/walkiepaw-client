import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './PostView.css';
import ReportModal from '../../components/ReportModal/ReportModal';
import KakaoWithoutSearch from '../../modules/KakaoWithoutSearch';

const SERVER_URL = 'https://192.168.0.45:8080/api/v1/posts';

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;
  const [showReportModal, setShowReportModal] = useState(false);
  const [status, setStatus] = useState(post?.status || '구인중');

  const currentUserId = '산책왕'; // 로그인한 유저의 ID와 해당 게시글을 작성한 유저의 ID를 비교

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handlerReport = (reason) => {
    console.log('신고 이유: ', reason);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    // 여기에 상태 변경을 서버에 저장하는 로직을 추가할 수 있습니다.
  };

  const handleEdit = () => {
    // 수정 페이지로 이동하는 로직
    navigate(`/modify-post/${postId}`, { state: { post } });
  };

  const handleDelete = () => {
    // 삭제 확인 및 처리 로직
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      console.log('삭제하기');
      // 여기에 실제 삭제 로직을 추가하세요
    }
  };

  return (
    <div className="post-view">
      <div className="post-content">
        <div className="image-slider">
          <img src={post.image} alt="Post" className="post-image" />
        </div>
        {post.memberId === currentUserId && (
          <div className="post-status">
            <select value={status} onChange={handleStatusChange}>
              <option value="구인중">구인중</option>
              <option value="구인 대기중">구인 대기중</option>
              <option value="구인 완료">구인 완료</option>
            </select>
          </div>
        )}
        <div className="post-header">
          <div className="author-info">
            <img
              src="https://via.placeholder.com/40"
              alt="Author"
              className="author-image"
            />
            <div className="author-details">
              <span className="author-name">{post.memberId}</span>
              <span className="post-location">{post.local}</span>
            </div>
          </div>
          <div className="rating">
            <span className="star">★</span> 5.0
          </div>
        </div>
        <div className="post-title">
          <span
            className={`post-status ${status.toLowerCase().replace(' ', '-')}`}
          >
            {status}
          </span>{' '}
          - {post.title}
        </div>
        <div className="post-content-description">{post.content}</div>
        <div className="post-location-map">
          <KakaoWithoutSearch defaultAddress={post.location} />
        </div>
        <div className="report-box">
          <button
            className="report-button"
            onClick={() => setShowReportModal(true)}
          >
            이 게시글 신고하기
          </button>
        </div>

        {post.memberId === currentUserId && (
          <div className="post-management">
            <button className="edit-button" onClick={handleEdit}>
              수정하기
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제하기
            </button>
          </div>
        )}
        <div className="massge-box">
          <button className="massge-button">채팅 하기</button>
        </div>
      </div>
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handlerReport}
        />
      )}
    </div>
  );
};

export default PostView;
