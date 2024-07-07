import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './PostView.css';
import KakaoWithoutSearch from '../../modules/KakaoWithoutSearch';
import pawpaw from './../../assets/pawpaw.png';
import PostReportModal from '../../components/ReportModal/PostReportModal';
import axios from 'axios';

const PostView = () => {
  const { postId } = useParams(); // URL에서 postId 파라미터를 가져옴
  const navigate = useNavigate();
  const location = useLocation();
  const [detailedLocation, setDetailedLocation] = useState();
  const [post, setPost] = useState(location.state?.post); // 게시글 상태
  const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 표시 상태
  const [status, setStatus] = useState(post?.status || '구인중');
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 이미지 슬라이드 인덱스
  const [priceProposal, setPriceProposal] = useState(post?.priceProposal); // 가격 협의 상태

  // BoardList에서 로그인한 유저의 id와 nickname을 가져옴
  // const memberNickName = location.status?.memberNickName;

  const [memberNickName, setMemberNickname] = useState(location.state?.memberNickName);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/boards/${postId}`);
        setDetailedLocation(response?.data?.detailedLocation);
        setPost(response?.data);
        setStatus(response?.data?.status);
      } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생', error);
      }
    };
    if (!post) {
      fetchPost();
    }
  }, [postId, post]);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const images = post.images || []; // 게시글에 이미지가 없으면 빈 배열로 초기화

  const handlerReport = (reason) => {
    console.log('신고 이유: ', reason);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // 게시글 상태 변경 즉시 반영
    try {
      // console.log(`게시글 상태 변경 확인!?!: ${newStatus}`);
      await axios.patch(`http://localhost:8080/api/v1/boards/status/${postId}`, {
        boardId: postId,
        status: newStatus,
      });
      const response = await axios.get(`http://localhost:8080/api/v1/boards/${postId}`);
      // console.log('상태 변경 됐니?!', response);
      setPost(response?.data);
      setStatus(response?.data?.status);
    } catch (error) {
      console.error('상태 변경 안됨!', error);
      alert('상태를 변경 오류!');
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동하는 로직
    navigate(`/modify-post/${postId}`, {
      state: {
        post: {
          ...post,
          priceType: post.priceType === 'HOURLY' ? '시급' : '일급',
          detailedLocation: detailedLocation,
          memberNickName: memberNickName,
        },
      },
    });
  };

  const handleDelete = async () => {
    // 삭제는 board_id는 남겨두고 '삭제된 게시글 입니다'라고 표시하기.
    // 삭제 확인 및 처리 로직
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/v1/boards/${postId}`);
        console.log('삭제 응답', response);
        alert('게시글이 삭제되었습니다.');
        // 카테고리 기반으로 경로 설정
        const categoryPath = post.category === 'JOB_OPENING' ? '/recruit' : '/jobs';
        navigate(categoryPath);
      } catch (error) {
        console.error('삭제 오류', error);
        alert('게시글을 삭제 할 수 없습니다.');
      }
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === post.images.length - 1 ? 0 : prevSlide + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === post.images.length - 1 ? 0 : prevSlide - 1));
  };

  const formatTime = (dataTimeString) => {
    const date = new Date(dataTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // 날짜와 시간 모두 포함한 문자열로 변환
  };

  const totalTime = (startTime, endTime) => {
    const start = new Date(startTime); // ISO 문자열에서 직접 Date 타입 객체로 변환
    const end = new Date(endTime);

    const diff = Math.abs(end - start) / 1000; // 초 단위로 차이 계산
    const hours = Math.floor(diff / 3600); // 시간 단위
    const minutes = Math.floor((diff % 3600) / 60); // 분 단위

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}일 ${remainingHours}시간`;
    } else {
      return `${hours}시간 ${minutes}분`;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'RECRUITING':
        return 'recruiting';
      case 'RESERVED':
        return 'reserved';
      case 'COMPLETED':
        return 'completed';
      default:
        return '';
    }
  };

  const formatToKRW = (value) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
    }).format(value);
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
              <img src={post.images[currentSlide]} alt="Post" className="post-image" />
              <button className="next-button" onClick={handleNextSlide}>
                &#10095;
              </button>
            </div>
          </div>
        )}
        {memberNickName === post.memberNickName && (
          <div className="post-status">
            <select value={status} onChange={handleStatusChange} className={getStatusClass(status)}>
              <option value="RECRUITING" className="post-status-option recruiting">
                모집중
              </option>
              <option value="RESERVED" className="post-status-option reserved">
                예약
              </option>
              <option value="COMPLETED" className="post-status-option completed">
                구인 완료
              </option>
            </select>
          </div>
        )}
        <div className="post-header">
          <div className="author-info">
            {' '}
            {/* 맴버 사진으로 넣어야함 */}
            <img src="https://via.placeholder.com/40" alt="Author" className="author-image" />
            <div className="author-details">
              <span className="author-name">{post.memberNickName}</span>
              <span className="post-location">{post.local}</span>
            </div>
          </div>
          <div className="rating">
            <img src={pawpaw} alt="Rating" className="Rating-images" /> 5.0 {/* 서버에서 평균값을 받아서 출력해야함 */}
          </div>
        </div>
        <div className="post-title">
          <span className={`post-status ${status.toLowerCase().replace(' ', '-')} ${getStatusClass(status)}`}>
            {status === 'RECRUITING' && '모집중'}
            {status === 'RESERVED' && '예약'}
            {status === 'COMPLETED' && '구인 완료'}
          </span>{' '}
          - {post.title}
        </div>
        <div className="post-content-description">
          <div className="post-info-box">
            <div className="post-info-item post-dateTime">
              날짜 및 시간 : {formatTime(post.startTime)} ~ {formatTime(post.endTime)}
              <div className="post-totalTime">총 시간: {totalTime(post.startTime, post.endTime)}</div>
            </div>
            <div className="post-info-item post-priceType">
              {post.priceType === 'HOURLY' && '시급'} {post.priceType === 'DAILY' && '일급'} : {formatToKRW(post.price)}
              원<div>가격 협의 : {priceProposal}</div>
            </div>
            <div className="post-info-item post-content-box">{post.content}</div>
          </div>
        </div>
        <div className="post-location-map">
          <KakaoWithoutSearch defaultAddress={post.location} />
        </div>
        <div className="post-location-box">지역 : {post.location}</div>
        <div className="post-detailedLocation-box">상세주소 : {detailedLocation}</div>
        <div className="report-box">
          <button className="report-button" onClick={() => setShowReportModal(true)}>
            이 게시글 신고하기
          </button>
        </div>

        {memberNickName === post.memberNickName && (
          <div className="post-management">
            <button className="edit-button" onClick={handleEdit}>
              수정하기
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제하기
            </button>
          </div>
        )}
        <div className="button-container">
          <button className="message-button">채팅 하기</button>
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
