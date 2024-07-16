import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoom from './ChatRoom';
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
  overflow: auto;
`;

const ChatLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatroomId: currentChatroomId } = useParams();
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);
  const webSocketConnected = useSelector(state => state.chat.webSocketConnected);
  const subscriptions = useSelector(state => state.chat.subscriptions);

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

  return (
      <ChatLayoutContainer>
        <ChatRoom
            onChatroomSelect={handleChatroomSelect}
            selectedChatroomId={selectedChatroomId}
        />
        <MainChatArea>
          <Outlet context={{ handleSendMessage }} />
        </MainChatArea>
      </ChatLayoutContainer>
  );
};

export default ChatLayout;