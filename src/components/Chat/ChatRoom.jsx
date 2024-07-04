import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import default_user from '../../assets/default_user.png';

const SidebarContainer = styled.div`
  width: 300px;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const StyledConversation = styled(Conversation)`
  display: flex;
  align-items: center;
  padding: 10px;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
`;

const Nickname = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #888;
  text-align: center;
`;

const ChatRoom = () => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/chatrooms', {
      params: { id: 1 } // 여기에 실제 memberId를 넣어야 합니다.
    })
    .then(response => {
      console.log(response.data);
      setChatrooms(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the chatrooms!', error);
    });
  }, []);

  return (
      <SidebarContainer>
        <ConversationList>
          {chatrooms.map(chatroom => (
              <StyledConversation
                  key={chatroom.id}
                  onClick={() => console.log(`Chatroom ${chatroom.id} clicked`)}
              >
                <AvatarWrapper>
                  <Avatar src={default_user} name={chatroom.nickname} />
                  <Nickname>{chatroom.nickname}</Nickname>
                </AvatarWrapper>
                <div>
                  <div>{chatroom.location}</div>
                  <div>{chatroom.lastMessage || '새로운 채팅방입니다.'}</div>
                </div>
              </StyledConversation>
          ))}
        </ConversationList>
      </SidebarContainer>
  );
}

export default ChatRoom;
