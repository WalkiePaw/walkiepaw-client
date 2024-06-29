import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './PostView.css';
import KakaoWithoutSearch from '../../modules/KakaoWithoutSearch';
import pawpaw from './../../assets/pawpaw.png';
import PostReportModal from '../../components/ReportModal/PostReportModal';
import axios from 'axios';

const SERVER_URL = 'https://192.168.0.45:8080/api/v1/posts';

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;
  const [showReportModal, setShowReportModal] = useState(false);
  const [status, setStatus] = useState(post?.status || '구인중');
  const [currentSlide, setCurrentSlide] = useState(0);

  const memberNickName = location.memberNickName; // BoardList에서 로그인한 유저의 id를 받아 옴

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const images = post.images || []; // 게시글에 이미지가 없으면 빈 배열로 초기화

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

  const handleDelete = async () => {
    // 삭제는 board_id는 남겨두고 '삭제된 게시글 입니다'라고 표시하기.
    // 삭제 확인 및 처리 로직
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(
          'http://localhost:8080/api/v1/posts/${postId}'
        );
        console.log('삭제 응답', response);
        navigate('/recruit');
      } catch (error) {
        console.error('삭제 오류', error);
        alert('게시글을 삭제 할 수 없습니다.');
      }
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === post.images.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === post.images.length - 1 ? 0 : prevSlide - 1
    );
  };

  return (
    <div className="post-view">
      <div className="post-content">
        {images.length > 0 && (
          <div className="image-slider">
            <div className="slider-container">
              <button className="prev-button" onClick={handlePrevSlide}>
                &#10094;
              </button>
              <img
                src={post.images[currentSlide]}
                alt="Post"
                className="post-image"
              />
              <button className="next-button" onClick={handleNextSlide}>
                &#10095;
              </button>
            </div>
          </div>
        )}
        {memberNickName === post.memberId && (
          <div className="post-status">
            <select value={status} onChange={handleStatusChange}>
              <option value="RECRUITING">구인중</option>
              <option value="RESERVED">구인 대기중</option>
              <option value="COMPLETED">구인 완료</option>
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
              <span className="author-name">{post.memberNickName}</span>
              <span className="post-location">{post.local}</span>
            </div>
          </div>
          <div className="rating">
            <img src={pawpaw} alt="Rating" className="Rating-images" /> 5.0
          </div>
        </div>
        <div className="post-title">
          <span
            className={`post-status ${status.toLowerCase().replace(' ', '-')}`}
          >
            {status === 'RECRUITING' && '구인중'}
            {status === 'RESERVED' && '구인 대기중'}
            {status === 'COMPLETED' && '구인 완료'}
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

        {memberNickName === post.memberId && (
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
        <PostReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handlerReport}
          boardId={postId}
          memberId={memberNickName}
        />
      )}
    </div>
  );
};

export default PostView;
