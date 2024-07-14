import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { useSelector } from "react-redux";
import default_user from '../../assets/default_user.png';

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
  const [chatrooms, setChatrooms] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const user = useSelector(state => state.auth.user);
  const id = user?.id;

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/chatrooms', {
      params: { id }
    })
    .then(response => {
      console.log('Chatrooms data:', response.data);
      setChatrooms(response.data.content);
      setPageInfo({
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        size: response.data.size,
        first: response.data.first,
        last: response.data.last,
        empty: response.data.empty
      });
    })
    .catch(error => {
      console.error('There was an error fetching the chatrooms!', error);
    });
  }, [id]);

  const formatTime = (timeString) => {
    const time = parse(timeString, 'HH:mm:ss.SSSSSS', new Date());
    return format(time, 'HH:mm:ss');
  };

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
                        {`${chatroom.latestMessage || '새로운 채팅방입니다.'} (${formatTime(chatroom.latestTime)})`}
                      </ConversationLastMessage>
                    </ConversationInfo>
                    {chatroom.unreadCount > 0 && <UnreadDot />}
                  </Conversation>
              ))
          ) : (
              <div>채팅방이 없습니다.</div>
          )}
        </ConversationList>
        {/* 페이지네이션 UI를 여기에 추가할 수 있습니다 */}
      </SidebarContainer>
  );
}

export default ChatRoom;