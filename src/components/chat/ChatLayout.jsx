// ChatLayout.jsx
import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  const webSocketConnected = useSelector(state => state.chat.webSocketConnected);
  const subscriptions = useSelector(state => state.chat.subscriptions);

  useEffect(() => {
    dispatch(connectWebSocket());
    return () => dispatch(disconnectWebSocket());
  }, [dispatch]);


  const handleChatroomSelect = useCallback((chatroomId) => {
    navigate(`/chat/${chatroomId}`);
    if (!subscriptions[chatroomId]) {
      dispatch(subscribeToChat(chatroomId));
    }
  }, [navigate, dispatch, subscriptions]);

  const handleSendMessage = useCallback((chatroomId, content) => {
    dispatch(sendWebSocketMessage({ chatroomId, content }));
  }, [dispatch]);

  return (
      <ChatLayoutContainer>
        <ChatRoom onChatroomSelect={handleChatroomSelect} />
        <MainChatArea>
          <Outlet context={{ handleSendMessage }} />
        </MainChatArea>
      </ChatLayoutContainer>
  );
};

export default ChatLayout;