import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ChatInput from '../../components/chat/ChatInput';
import { useOutletContext, useParams } from "react-router-dom";

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 100%; // 전체 높이를 사용하도록 설정
`;

const ChatHeader = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  font-weight: bold;
`;

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  padding: 10px;
  flex: 1;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  text-align: ${props => props.$isOutgoing ? 'right' : 'left'};
`;

const MessageContent = styled.div`
  display: inline-block;
  background-color: ${props => props.$isOutgoing ? '#dcf8c6' : '#fff'};
  border-radius: 10px;
  padding: 8px 12px;
  max-width: 70%;
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

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const { chatroomId } = useParams();
  const { id, messages: contextMessages, handleSendMessage } = useOutletContext();
  const messageListRef = useRef(null);
  const fetchMessages = useCallback(async () => {
    if (!chatroomId) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/chats?chatroomId=${chatroomId}`);
      const formattedMessages = response.data.map(msg => ({
        content: msg.content,
        sentTime: new Date(msg.createDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.nickname,
        isOutgoing: msg.writerId === id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  }, [chatroomId, id]);

  useEffect(() => {
    if (chatroomId) {
      fetchMessages();
    }
  }, [chatroomId, fetchMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const onSendMessage = (content) => {
    if (chatroomId) {
      handleSendMessage(chatroomId, content);
    } else {
      console.error('No chatroomId available');
    }
  };


  return (
      <ChatArea>
        <ChatHeader>Chat Room {chatroomId}</ChatHeader>
        <MessageListContainer>
          <MessageList ref={messageListRef}>
            {messages.map((msg, index) => (
                <MessageItem key={index} $isOutgoing={msg.isOutgoing}>
                  <MessageContent $isOutgoing={msg.isOutgoing}>
                    <MessageSender>{msg.sender}</MessageSender>
                    {msg.content}
                    <MessageTime>{msg.sentTime}</MessageTime>
                  </MessageContent>
                </MessageItem>
            ))}
          </MessageList>
        </MessageListContainer>
        <ChatInputContainer>
          <ChatInput onSend={onSendMessage} />
        </ChatInputContainer>
      </ChatArea>
  );
};

export default ChatPage;