import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComments, faStar } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const HeaderContainer = styled.div`
  background-color: #E8C5A5;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #D7B392;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 1.5rem;
  margin-right: 10px;
`;

const Title = styled.span`
  color: #43312A;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewButton = styled(motion.button)`
  background-color: #43312A;
  color: #E8C5A5;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
`;

const ChatIcon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 1.2rem;
`;

const ChatHeader = ({ boardTitle, chatroomId, revieweeId }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const currentUser = useSelector(state => state.auth.user); // 현재 로그인한 사용자 정보 가져오기

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (rating, content) => {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // 또는 Redux store에서 토큰을 가져옵니다
      const response = await axios.post('/api/v1/reviews', {
        reviewerId: currentUser.id,
        revieweeId: revieweeId,
        rating: rating,
        content: content,
        chatroomId: chatroomId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Review submitted successfully', response.data);
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  return (
      <HeaderContainer>
        <TitleContainer>
          <Icon icon={faPaw} />
          <Title>{boardTitle || '채팅방'}</Title>
        </TitleContainer>
        <ButtonContainer>
          <ReviewButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReviewClick}
          >
            <FontAwesomeIcon icon={faStar} style={{ marginRight: '5px' }} />
            리뷰하기
          </ReviewButton>
          <ChatIcon icon={faComments} />
        </ButtonContainer>
        <AnimatePresence>
          {isReviewModalOpen && (
              <ReviewModal
                  onClose={() => setIsReviewModalOpen(false)}
                  onSubmit={handleSubmitReview}
              />
          )}
        </AnimatePresence>
      </HeaderContainer>
  );
};

const ReviewModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
      >
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              width: '300px'
            }}
        >
          <h2>리뷰 작성</h2>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    style={{ color: star <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
                    onClick={() => setRating(star)}
                />
            ))}
          </div>
          <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="리뷰 내용을 입력하세요"
              style={{ width: '100%', height: '100px', margin: '10px 0' }}
          />
          <button onClick={() => onSubmit(rating, content)}>제출</button>
          <button onClick={onClose}>취소</button>
        </motion.div>
      </motion.div>
  );
};

export default ChatHeader;