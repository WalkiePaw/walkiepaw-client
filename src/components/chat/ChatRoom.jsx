import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setChatrooms } from '../../store/ChatSlice';
import default_user from '../../assets/default_user.png';
import styled from "styled-components";
import LoadingComponent from "./LoadingComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const SidebarContainer = styled.div`
  width: 300px;
  border-right: 1px solid #D7B392;
  height: 100vh;
  background-color: #F5E6D3;
  overflow-y: auto;
`;

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Conversation = styled.div.attrs(props => ({
  onClick: props.onClick
}))`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #E8C5A5;
  background-color: ${props => props.$isSelected ? '#E8C5A5' : 'transparent'};

  &:hover {
    background-color: ${props => props.$isSelected ? '#E8C5A5' : '#F0D9B5'};
  }
`;

const ConversationLastMessage = styled.div`
  font-size: 0.9em;
  color: #5A443C;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const MessageText = styled.span`
  color: #5A443C;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageTime = styled.span`
  color: #8B7B6B;
  font-size: 0.8em;
  margin-left: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const ConversationInfo = styled.div`
  flex: 1;
`;

const ConversationName = styled.div`
  font-weight: bold;
  color: #43312A;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LocationIcon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 0.8rem;
  margin: 0 5px;
`;


const UnreadDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #43312A;
  border-radius: 50%;
  margin-left: 10px;
`;

const dongFromLocal = (location) => {
  const match = location?.match(/[가-힣]+동/);
  return match ? match[0] : location;
};


const ChatRoom = ({ onChatroomSelect, selectedChatroomId }) => {
  const dispatch = useDispatch();
  const chatrooms = useSelector(state => state.chat.chatrooms);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user && user.id) {
      axios.get('http://57.180.244.228:8000/api/v1/chatrooms', {
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

  function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

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
                  <Conversation
                      key={chatroom.id}
                      onClick={() => onChatroomSelect(chatroom.id)}
                      $isSelected={chatroom.id === selectedChatroomId}
                  >
                    <Avatar
                        src={chatroom.memberPhoto ? chatroom.memberPhoto : default_user}
                        alt={chatroom.nickname}
                    />
                    <ConversationInfo>
                      <ConversationName>
                        {chatroom.nickname}
                        <LocationIcon icon={faMapMarkerAlt} />
                        {dongFromLocal(chatroom.location)}
                      </ConversationName>
                      <ConversationLastMessage>
                        <MessageText>
                          {chatroom.latestMessage || '새로운 채팅방입니다.'}
                        </MessageText>
                        <MessageTime>
                          {formatTime(chatroom.latestTime)}
                        </MessageTime>
                      </ConversationLastMessage>
                    </ConversationInfo>
                    {chatroom.unreadCount > 0 && <UnreadDot />}
                  </Conversation>
              ))
          ) : (
              <LoadingComponent message="채팅방이 없습니다" />
          )}
        </ConversationList>
      </SidebarContainer>
  );
}


export default ChatRoom;