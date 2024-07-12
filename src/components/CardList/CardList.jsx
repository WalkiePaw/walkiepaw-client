// src/component/CardList/CardList
import React, { useState, useCallback } from 'react';
import './CardList.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import ImageUpload from '../ImageUpload';
import { getProfileImage } from '../../util/profile-img';

const CardList = ({
  title,
  location,
  photoUrls,
  memberNickName,
  memberPhoto,
  status,
  category,
  price,
  priceType,
  startTime,
  endTime,
  onCardClick,
  initialLiked,
  onLikeChange,
  boardId,
  likeCount,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount); // 좋아요 수 상태 추가

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      const newLikedState = !liked;
      setLiked(newLikedState);
      setCurrentLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1)); // 좋아요 수 즉시 업데이트
      onLikeChange(boardId, newLikedState);
    },
    [liked, onLikeChange, boardId]
  );

  // 시간 계산
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0'); // padStart(2, '0')은 9:00을 09:00으로 표시해주는 기능
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const totalTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    let totalMinutes = (end - start) / (1000 * 60);

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // 종료 시간이 다음날인 경우
    }

    const days = Math.floor(totalMinutes / (24 * 60));
    totalMinutes %= 24 * 60; // 전체 분에서 날짜 단위 분을 제외
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let result = '';
    if (days > 0) {
      result = `${days}일`;
    }
    if (hours > 0) {
      result = `${hours}시간`;
    }
    if (minutes > 0) {
      result = `${minutes}분`;
    }
    return result.trim();
  };

  const formatToKRW = (value) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
    }).format(value);
  };

  return (
    <div className="CardStyled" onClick={onCardClick}>
      <div className="Locals">
        <div className="member-info">
          <img src={memberPhoto || '/src/assets/default_user.png'} alt="Author" className="author-image" />
        </div>
        <div className="MemberNickName">{memberNickName}</div>
        <div className="Local">{location}</div>
      </div>
      <div className="Title">
        <span className={`post-status ${status?.toLowerCase()?.replace(' ', '-')}`}>
          {status === 'RECRUITING' && '모집중'}
          {status === 'RESERVED' && '예약'}
          {status === 'COMPLETED' && '구인 완료'}
        </span>
        {` - ${title}`}
      </div>
      <div className="Time">
        <ul>
          <li>총 시간: {totalTime(startTime, endTime)}</li>
          <li>
            시간: {formatTime(startTime)} ~ {formatTime(endTime)}
          </li>
        </ul>
      </div>
      <div className="Price">
        {priceType === 'HOURLY' && '시급'} {priceType === 'DAILY' && '일급'} 금액: {formatToKRW(price)}원
      </div>
      <div className="CardImageBox">
        {photoUrls && photoUrls.length > 0 ? (
          <img className="CardImage" src={photoUrls} alt="card" />
        ) : (
          <div className="NoImagePlaceholder">No Image Available</div>
        )}
      </div>
      <div className="Icons">
        <div className="Icon" onClick={handleLike}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? 'red' : 'gray'} />
          <span>{currentLikeCount}</span>
        </div>
      </div>
    </div>
  );
};

CardList.propTypes = {
  initialLiked: PropTypes.bool.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  boardId: PropTypes.number.isRequired,
  likeCount: PropTypes.number.isRequired,
  memberPhoto: PropTypes.string,
};

export default CardList;
