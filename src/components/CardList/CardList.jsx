// src/component/CardList/CardList
import React, { useState } from 'react';
import './CardList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const CardList = ({
  title,
  location,
  image,
  memberNickName,
  status,
  category,
  price,
  priceType,
  startTime,
  endTime,
  onCardClick,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (!liked) {
      setLiked(true);
      setLikeCount(likeCount + 1);
    } else {
      setLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

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

  return (
    <div className="CardStyled" onClick={onCardClick}>
      <div className="Locals">
        <div className="author-info">
          {' '}
          {/* 맴버 사진으로 넣어야함 */}
          <img src="https://via.placeholder.com/40" alt="Author" className="author-image" />
        </div>
        <div className="MemberNickName">{memberNickName}</div>
        <div className="Local">{location}</div>
      </div>
      <div className="Title">
        <span className={`post-status ${status?.toLowerCase()?.replace(' ', '-')}`}>
          {status === 'RECRUITING' && '구인중'}
          {status === 'RESERVED' && '구인 대기중'}
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
        {priceType === 'HOURLY' && '시급'} {priceType === 'DAILY' && '일급'} 금액: {price}
      </div>
      <div className="CardImageBox">
        <img className="CardImage" src={image} alt="card" />
      </div>
      <div className="Icons">
        <div className="Icon" onClick={handleLike}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? 'red' : 'gray'} />
          <span>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CardList;
