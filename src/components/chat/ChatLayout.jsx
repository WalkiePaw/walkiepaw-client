import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoom from './ChatRoom';
import ChatHeader from './ChatHeader';  // ChatHeader import 추가
import styled from 'styled-components';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChat,
  sendWebSocketMessage
} from '../../store/ChatSlice.jsx';

const ChatLayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatroomId: currentChatroomId } = useParams();
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);
  const webSocketConnected = useSelector(state => state.chat.webSocketConnected);
  const subscriptions = useSelector(state => state.chat.subscriptions);
  const chatrooms = useSelector(state => state.chat.chatrooms);

  useEffect(() => {
    dispatch(connectWebSocket());
    return () => dispatch(disconnectWebSocket());
  }, [dispatch]);

  useEffect(() => {
    if (currentChatroomId) {
      setSelectedChatroomId(parseInt(currentChatroomId));
    }
  }, [currentChatroomId]);

  const handleChatroomSelect = useCallback((chatroomId) => {
    setSelectedChatroomId(chatroomId);
    navigate(`/chat/${chatroomId}`);
    if (!subscriptions[chatroomId] && webSocketConnected) {
      dispatch(subscribeToChat(chatroomId));
    }
  }, [navigate, dispatch, subscriptions, webSocketConnected]);

  const handleSendMessage = useCallback((chatroomId, content) => {
    dispatch(sendWebSocketMessage({ chatroomId, content }))
    .catch(error => console.error('Failed to send message:', error));
  }, [dispatch]);

  // 현재 선택된 채팅방 정보 가져오기
  const currentChatroom = chatrooms.find(room => room.id === selectedChatroomId);

  return (
      <ChatLayoutContainer>
        <ChatRoom
            onChatroomSelect={handleChatroomSelect}
            selectedChatroomId={selectedChatroomId}
        />
        <MainChatArea>
          {currentChatroom && (
              <ChatHeader
                  boardTitle={currentChatroom.boardTitle}
                  chatroomId={currentChatroom.id}
                  revieweeId={currentChatroom.memberId}  // 또는 상대방의 ID를 나타내는 적절한 필드
              />
          )}
          <ChatContent>
            <Outlet context={{ handleSendMessage }} />
          </ChatContent>
        </MainChatArea>
      </ChatLayoutContainer>
  );
};

export default ChatLayout;