// ChatLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatRoom from './ChatRoom';
import styled from 'styled-components';

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

  const handleChatroomSelect = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
  };

  return (
      <ChatLayoutContainer>
        <ChatRoom onChatroomSelect={handleChatroomSelect} />
        <MainChatArea>
          <Outlet context={{ id }} />
        </MainChatArea>
      </ChatLayoutContainer>
  );
};

export default ChatLayout;