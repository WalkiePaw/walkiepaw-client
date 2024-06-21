import React, { useState } from 'react';
import './CardList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const CardList = ({ title, local, image, memberId, onCardClick }) => {
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

  return (
    <div className="CardStyled" onClick={onCardClick}>
      <div className="Locals">
        <div className="MemberId">{memberId}</div>
        <div className="Local">{local}</div>
      </div>
      <div className="Title">{title}</div>
      <div className="CardImageBox">
        <img className="CardImage" src={image} alt="image" />
      </div>
      <div className="Icons">
        <div className="Icon" onClick={handleLike}>
          <FontAwesomeIcon
            icon={liked ? solidHeart : regularHeart}
            color={liked ? 'red' : 'gray'}
          />
          <span>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CardList;
