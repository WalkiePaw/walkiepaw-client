import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { setChatrooms } from '../../store/ChatSlice';
import default_user from '../../assets/default_user.png';
import styled from "styled-components";


const SidebarContainer = styled.div`
  width: 300px;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Conversation = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ConversationInfo = styled.div`
  flex: 1;
`;

const ConversationName = styled.div`
  font-weight: bold;
`;

const ConversationLastMessage = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const UnreadDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
  margin-left: 10px;
`;

const ChatRoom = ({ onChatroomSelect }) => {
  const dispatch = useDispatch();
  const chatrooms = useSelector(state => state.chat.chatrooms);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user && user.id) {
      axios.get('http://localhost:8080/api/v1/chatrooms', {
        params: { id: user.id }
      })
      .then(response => {
        console.log('Chatrooms data:', response.data);
        dispatch(setChatrooms(response.data.content));
      })
      .catch(error => {
        console.error('There was an error fetching the chatrooms!', error);
      });
    }
  }, [user, dispatch]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return timeString;
    } catch (error) {
      console.error('Invalid time format:', timeString);
      return '';
    }
  };


  // 채팅방을 최신 메시지 시간 순으로 정렬
  const sortedChatrooms = useMemo(() => {
    return [...chatrooms]
    .filter(chatroom => chatroom.latestTime)
    .sort((a, b) => new Date(b.latestTime) - new Date(a.latestTime));
  }, [chatrooms]);

  return (
      <SidebarContainer>
        <ConversationList>
          {chatrooms.length > 0 ? (
              chatrooms.map(chatroom => (
                  <Conversation key={chatroom.id} onClick={() => onChatroomSelect(chatroom.id)}>
                    <Avatar src={default_user} alt={chatroom.location} />
                    <ConversationInfo>
                      <ConversationName>{`${chatroom.nickname} - ${chatroom.location}`}</ConversationName>
                      <ConversationLastMessage>
                        {`${chatroom.latestMessage || '새로운 채팅방입니다.'} ${formatTime(chatroom.latestTime)}`}
                      </ConversationLastMessage>
                    </ConversationInfo>
                    {chatroom.unreadCount > 0 && <UnreadDot />}
                  </Conversation>
              ))
          ) : (
              <div>채팅방이 없습니다.</div>
          )}
        </ConversationList>
      </SidebarContainer>
  );
}

export default ChatRoom;