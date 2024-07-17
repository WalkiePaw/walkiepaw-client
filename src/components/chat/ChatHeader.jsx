import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faComments,
  faStar,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ReviewForm from "../ReviewForm.jsx";
import MemberPhoto  from "./MemberPhoto.jsx";
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 350px;
  position: relative;
`;

const ModalTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #43312A;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #43312A;
`;

const ChatHeader = ({ boardTitle, chatroomId, revieweeId, memberPhoto, memberNickName }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const currentUser = useSelector(state => state.auth.user);

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async ({ points, content }) => {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/v1/reviews', {
        reviewerId: currentUser.id,
        revieweeId: revieweeId,
        rating: points,
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
          <MemberPhoto memberPhoto={memberPhoto} memberNickName={memberNickName} />
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
              <ModalOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
              >
                <ModalContent
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                >
                  <CloseButton
                      onClick={() => setIsReviewModalOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </CloseButton>
                  <ModalTitle>리뷰 작성</ModalTitle>
                  <ReviewForm onSubmit={handleSubmitReview} />
                </ModalContent>
              </ModalOverlay>
          )}
        </AnimatePresence>
      </HeaderContainer>
  );
};

export default ChatHeader;