import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faComments,
  faStar,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewForm from "../ReviewForm.jsx";
import MemberPhoto  from "./MemberPhoto.jsx";
import BoardStatusDropdown from "./BoardStatusDropdown.jsx";
import { updateChatroomStatus } from '../../store/ChatSlice';
import {submitReview} from "../../Api.jsx";
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
  margin-left: auto; // 이 줄을 추가하여 버튼 컨테이너를 오른쪽으로 밀어냅니다.
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
  margin-right: 10px; // 이 줄을 제거하거나 주석 처리합니다.
`;

const ChatIcon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 1.2rem;
  margin-left: 10px; // 이 줄을 추가하여 채팅 아이콘과 리뷰 버튼 사이에 간격을 줍니다.
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

const TitleStatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ChatHeader = ({
  boardTitle,
  chatroomId,
  revieweeId,
  memberPhoto,
  memberNickName,
  boardWriter,
  initialBoardStatus,
  category
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const boardStatus = useSelector(state =>
      state.chat.chatrooms.find(room => room.id === chatroomId)?.boardStatus || initialBoardStatus
  );

  const handleReviewClick = useCallback(() => {
    if (boardStatus === 'COMPLETED') {
      setIsReviewModalOpen(true);
    } else {
      toast.warn('거래가 완료된 후에만 리뷰를 작성할 수 있습니다.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [boardStatus]);

  const handleSubmitReview = async ({ points, content }) => {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    try {
      const reviewData = {
        reviewerId: currentUser.id,
        revieweeId: revieweeId,
        point: points,
        content: content,
        chatroomId: chatroomId,
        category: category
      };

      const response = await submitReview(reviewData);
      console.log('Review submitted:', response);
      setIsReviewModalOpen(false);
      toast.success('리뷰가 성공적으로 제출되었습니다!', {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('리뷰 제출 중 오류가 발생했습니다. 다시 시도해주세요.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateChatroomStatus({ chatroomId, status: newStatus }));
  };

  return (
      <HeaderContainer>
        <TitleContainer>
          <MemberPhoto memberPhoto={memberPhoto} memberNickName={memberNickName} revieweeId={revieweeId} />
          <Icon icon={faPaw} />
          <TitleStatusContainer>
            <Title>{boardTitle || '채팅방'}</Title>
            <BoardStatusDropdown
                status={boardStatus}
                isBoardWriter={boardWriter}
                chatroomId={chatroomId}
                onStatusChange={handleStatusChange}
            />
          </TitleStatusContainer>
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
                  <ReviewForm onSubmit={handleSubmitReview} category={category}/>
                </ModalContent>
              </ModalOverlay>
          )}
        </AnimatePresence>
      </HeaderContainer>
  );
};

export default ChatHeader;