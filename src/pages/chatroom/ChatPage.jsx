import React, { useEffect, useRef, useCallback } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import ChatInput from '../../components/chat/ChatInput';
import LoadingComponent from "../../components/chat/LoadingComponent.jsx";
import { useParams, useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessages,
  subscribeToChat,
  sendWebSocketMessage,
  receiveMessage
} from '../../store/ChatSlice';

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 100%;
`;

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const MessageItem = styled.div`
  display: flex;
  flex-direction: ${props => props.$isOutgoing ? 'row-reverse' : 'row'};
  margin-bottom: 10px;
`;

const MessageContent = styled.div`
  background-color: ${props => props.$isOutgoing ? '#E8C5A5' : '#fff'};
  border-radius: 10px;
  padding: 8px 12px;
  max-width: 70%;
  ${props => props.$isOutgoing ? 'margin-left: auto;' : ''}
`;

const MessageSender = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-bottom: 2px;
`;

const MessageTime = styled.div`
  font-size: 0.7em;
  color: #999;
  margin-top: 2px;
`;

const ChatInputContainer = styled.div`
  padding: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #e0e0e0;
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 10px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }

  span {
    padding: 0 10px;
    background-color: #f8f8f8;
    color: #666;
    font-size: 0.8em;
  }
`;

const selectChatMessages = createSelector(
    [(state) => state.chat.messages, (_, chatroomId) => chatroomId],
    (messages, chatroomId) => messages[chatroomId] || []
);

const selectUser = (state) => state.auth.user;
const selectSubscriptions = (state) => state.chat.subscriptions;
const selectChatrooms = (state) => state.chat.chatrooms;

const formatDate = (dateString) => {
  return format(new Date(dateString), 'yyyy년 M월 d일', { locale: ko });
};

const formatTime = (dateString) => {
  return format(new Date(dateString), 'a h:mm', { locale: ko });
};

const ChatPage = () => {
  const { chatroomId } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector(state => selectChatMessages(state, chatroomId));
  const user = useSelector(selectUser);
  const subscriptions = useSelector(selectSubscriptions);
  const chatrooms = useSelector(selectChatrooms);
  const messageListRef = useRef(null);
  const { handleSendMessage } = useOutletContext();

  const currentChatroom = chatrooms.find(room => room.id === parseInt(chatroomId));
  const boardTitle = currentChatroom ? currentChatroom.boardTitle : '채팅방';

  const fetchMessages = useCallback(async () => {
    if (!chatroomId || !user) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/chats?chatroomId=${chatroomId}`);
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        content: msg.content,
        createDate: msg.createDate,
        sender: msg.nickname,
        isOutgoing: msg.writerId === user.id
      }));
      dispatch(setMessages({ chatroomId, messages: formattedMessages }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  }, [chatroomId, user, dispatch]);

  useEffect(() => {
    if (chatroomId && user) {
      fetchMessages();
      if (!subscriptions[chatroomId]) {
        dispatch(subscribeToChat(chatroomId));
      }
    }
  }, [chatroomId, fetchMessages, dispatch, user, subscriptions]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const onSendMessage = (content) => {
    if (chatroomId && user && user.id) {
      handleSendMessage(chatroomId, content);
    } else {
      console.error('No chatroomId or user available');
    }
  };

  const renderMessages = () => {
    let currentDate = null;
    return messages.map((msg, index) => {
      const formattedDate = formatDate(msg.createDate);

      let dateDivider = null;
      if (formattedDate !== currentDate) {
        dateDivider = <DateDivider key={`date-${formattedDate}`}><span>{formattedDate}</span></DateDivider>;
        currentDate = formattedDate;
      }

      return (
          <React.Fragment key={msg.id || index}>
            {dateDivider}
            <MessageItem $isOutgoing={msg.isOutgoing}>
              <MessageContent $isOutgoing={msg.isOutgoing}>
                <MessageSender>{msg.sender}</MessageSender>
                {msg.content}
                <MessageTime>
                  {formatTime(msg.createDate)}
                </MessageTime>
              </MessageContent>
            </MessageItem>
          </React.Fragment>
      );
    });
  };

  if (!user) {
    return <LoadingComponent message="채팅방 정보를 불러오는 중" />;
  }

  return (
      <ChatArea>
        <MessageListContainer ref={messageListRef}>
          {renderMessages()}
        </MessageListContainer>
        <ChatInputContainer>
          <ChatInput onSend={onSendMessage} />
        </ChatInputContainer>
      </ChatArea>
  );
};

export default ChatPage;