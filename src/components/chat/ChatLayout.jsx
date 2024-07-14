// ChatLayout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatRoom from './ChatRoom';
import styled from 'styled-components';
import useWebSocket from './useWebSocket';

const ChatLayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainChatArea = styled.div`
  flex: 1;
  overflow: auto;
`;

const ChatLayout = () => {
  const user = useSelector(state => state.auth.user);
  const id = user?.id;
  const navigate = useNavigate();
  const [messages, setMessages] = useState({});
  const { connect, disconnect, subscribe, unsubscribe, send } = useWebSocket('http://localhost:8080/ws');
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const handleMessage = useCallback((message) => {
    setMessages(prev => ({
      ...prev,
      [message.chatroomId]: [...(prev[message.chatroomId] || []), message]
    }));
  }, []);

  const handleChatroomSelect = useCallback((chatroomId) => {
    navigate(`/chat/${chatroomId}`);

    if (currentSubscription) {
      unsubscribe(currentSubscription);
    }

    const newSubscription = subscribe(`/chats/${chatroomId}`, handleMessage);
    setCurrentSubscription(newSubscription);
  }, [navigate, subscribe, unsubscribe, handleMessage, currentSubscription]);

  const handleSendMessage = useCallback((chatroomId, content) => {
    send(`/api/v1/ws/chats/${chatroomId}`, { content, writerId: id, chatroomId });
  }, [send, id]);

  return (
      <ChatLayoutContainer>
        <ChatRoom onChatroomSelect={handleChatroomSelect} />
        <MainChatArea>
          <Outlet context={{ id, messages, handleSendMessage }} />
        </MainChatArea>
      </ChatLayoutContainer>
  );
};

export default ChatLayout;