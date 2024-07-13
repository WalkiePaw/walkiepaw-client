// src/component/CardList/CardList
import React, { useState, useCallback, useEffect } from "react";
// import './CardList.css';
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const CardList = ({
  boardId,
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
  initialLikeCount,
  id,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeChangeTimeout, setLikeChangeTimeout] = useState(null);

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      console.log("Clicked like button. BoardId:", boardId); // boardId 로깅
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikeCount((prevCount) =>
        newLikedState ? prevCount + 1 : prevCount - 1
      );

      // 기존의 타이머를 취소
      if (likeChangeTimeout) {
        clearTimeout(likeChangeTimeout);
      }

      // 새로운 타이머 설정
      const newTimeout = setTimeout(() => {
        updateLikeToServer(newLikedState);
      }, 3000);

      setLikeChangeTimeout(newTimeout);
    }
  );

  const updateLikeToServer = async (isLiked) => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:8080/api/v1/boards-like`, {
          id,
          boardId,
        });
      } else {
        await axios.delete(`http://localhost:8080/api/v1/boards-like`, {
          data: { id, boardId },
        });
      }
    } catch (error) {
      console.error("Failed to update like", error);
      // 에러 발생 시 UI를 원래 상태로 되돌림
      setLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    }
  };

  useEffect(() => {
    return () => {
      if (likeChangeTimeout) {
        clearTimeout(likeChangeTimeout);
      }
    };
  }, [likeChangeTimeout]);

  // 시간 계산
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, "0"); // padStart(2, '0')은 9:00을 09:00으로 표시해주는 기능
    const minutes = date.getMinutes().toString().padStart(2, "0");
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

    let result = "";
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
    return new Intl.NumberFormat("ko-KR", {
      style: "decimal",
    }).format(value);
  };

  return (
    <CardStyled onClick={onCardClick}>
      <Locals>
        <MemberInfo>
          <AuthorImage
            src={memberPhoto || "/src/assets/default_user.png"}
            alt="Author"
          />
          <MemberNickName>{memberNickName}</MemberNickName>
        </MemberInfo>
        <Local>📍{location}</Local>
      </Locals>
      <Title>
        <PostStatus
          className={`post-status ${status?.toLowerCase()?.replace(" ", "-")}`}
        >
          {status === "RECRUITING" && "모집중"}
          {status === "RESERVED" && "예약"}
          {status === "COMPLETED" && "구인 완료"}
        </PostStatus>
        {` ${title}`}
      </Title>
      <CardImageBox>
        {photoUrls && photoUrls.length > 0 ? (
          <CardImage src={photoUrls} alt="card" />
        ) : (
          <NoImagePlaceholder>No Image Available</NoImagePlaceholder>
        )}
      </CardImageBox>
      <Time>
        시간: {formatTime(startTime)} - {formatTime(endTime)} (총{" "}
        {totalTime(startTime, endTime)})
      </Time>
      <Price>
        {priceType === "HOURLY" && "시급"} {priceType === "DAILY" && "일급"}: ₩
        {formatToKRW(price)}
      </Price>
      <Icons>
        <Icon onClick={handleLike}>
          <FontAwesomeIcon
            icon={liked ? solidHeart : regularHeart}
            color={liked ? "red" : "gray"}
          />
          <span>{likeCount}</span>
        </Icon>
      </Icons>
    </CardStyled>
  );
};

CardList.propTypes = {
  initialLiked: PropTypes.bool.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  boardId: PropTypes.number.isRequired,
  likeCount: PropTypes.number.isRequired,
  memberPhoto: PropTypes.string,
  id: PropTypes.number.isRequired,
  initialLikeCount: PropTypes.number.isRequired,
};

export default CardList;

// styled-components를 이용한 스타일 정의
const CardStyled = styled.div`
  background: #f9f3e6;
  border-radius: 8px;
  border: 2px solid #8d6e63; /* 테두리 라인 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 16px;
  overflow: hidden;
  cursor: pointer;
  flex-direction: column;
  width: 100%; // 카드 너비를 늘림
  max-width: 1200px; // 최대 너비를 설정
  margin-left: auto; // 좌우 중앙 정렬
  margin-right: auto; // 좌우 중앙 정렬
  &:hover {
    transform: translateY(-5px);
  }
`;

const Locals = styled.div`
  display: flex;
  justify-content: space-between; // location을 오른쪽 끝으로 이동
  align-items: center;
  padding: 8px 16px;
  border-bottom: 2px solid #8d6e63; /* 구분선 */
  font-weight: bold;
`;

const Local = styled.div`
  color: #6d4c41; /* 갈색으로 설정 */
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

const MemberNickName = styled.div`
  font-weight: bold;
`;

const Title = styled.div`
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 3px;
`;

const PostStatus = styled.span`
  padding: 2px 4px;
  border-radius: 4px;
  margin-right: 8px;
  &.recruiting {
    background-color: #e0f7fa;
    color: #00796b;
  }
  &.reserved {
    background-color: #ffe0b2;
    color: #f57c00;
  }
  &.completed {
    background-color: #fce4ec;
    color: #d81b60;
  }
`;

const Time = styled.div`
  padding: 8px 16px;
  color: #333;
`;

const Price = styled.div`
  padding: 8px 16px;
  color: #333;
  margin-top: -8px; /* 시간과 가격 사이 간격 조정 */
`;

const CardImageBox = styled.div`
  width: calc(100% - 32px); // 이미지 양옆 여백 추가
  height: 200px;
  background: #f0f0f0;
  margin: 0 16px; // 이미지 양옆 여백 추가
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px; /* 이미지 테두리 둥글게 */
  overflow: hidden; /* 둥글게 된 테두리를 위해 필요 */
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImagePlaceholder = styled.div`
  color: #888;
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #888;
  & > span {
    margin-left: 4px;
  }
`;
