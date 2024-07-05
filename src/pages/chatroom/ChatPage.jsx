import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  ChatContainer,
  MessageList,
  Message,
  Avatar,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react'; // 올바른 컴포넌트만 import
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatRoom from '../../components/Chat/ChatRoom.jsx'; // 경로 확인
import ChatInput from '../../components/Chat/ChatInput.jsx'; // 경로 확인

const ChatLayout = styled.div`
  display: flex;
  margin-top: 0.1rem;
  height: calc(100vh - 0.1rem);
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

const StyledChatContainer = styled(ChatContainer)`
  height: 100%;
  overflow: hidden;
`;

const StyledMessageList = styled(MessageList)`
  overflow-y: auto;
`;

const StyledConversationHeader = styled(ConversationHeader)`
  background-color: #f0f0f0;
  padding: 10px;
`;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);
  const currentUserId = 1; // 현재 사용자의 ID

  useEffect(() => {
    if (selectedChatroomId) {
      axios.get(`http://localhost:8080/api/v1/chats?chatroomId=${selectedChatroomId}`)
      .then(response => {
        console.log(response.data);
        const formattedMessages = response.data.map(msg => ({
          message: msg.content,
          sentTime: new Date(msg.createDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.nickname,
          direction: msg.writerId === currentUserId ? "outgoing" : "incoming",
          position: "single"
        }));
        setMessages(formattedMessages);
      })
      .catch(error => {
        console.error('Error fetching chat messages:', error);
      });
    }
  }, [selectedChatroomId]);

  const handleChatroomSelect = (chatroomId) => {
    setSelectedChatroomId(chatroomId);
  };

  const addMessage = async (newMessage) => {
    if (!selectedChatroomId) {
      console.error('No chatroom selected');
      return;
    }

    try {
      const chatAddRequest = {
        content: newMessage,
        chatroomId: selectedChatroomId,
        writerId: currentUserId
      };

      const response = await axios.post('http://localhost:8080/api/v1/chats', chatAddRequest);

      if (response.status === 201) { // 성공적으로 생성됨
        setMessages(prevMessages => [...prevMessages, {
          message: newMessage,
          sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: "나",
          direction: "outgoing",
          position: "single",
          writerId: currentUserId
        }]);
      } else {
        console.error('Failed to add message');
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return (
      <ChatLayout>
        <ChatRoom onChatroomSelect={handleChatroomSelect} />
        <ChatArea>
          <StyledChatContainer>
            <StyledConversationHeader>
              <Avatar src="path_to_golden_retriever.jpg" name="골댕이" />
              <ConversationHeader.Content userName="골댕이" info="안읽은 메세지만 보기" />
            </StyledConversationHeader>
            <StyledMessageList>
              {messages.map((msg, index) => (
                  <Message key={index} model={msg}>
                    {msg.direction === "incoming" && (
                        <Avatar src="path_to_avatar_image.jpg" name={msg.sender} />
                    )}
                    <Message.Header sender={msg.sender} sentTime={msg.sentTime} />
                    {msg.message}
                  </Message>
              ))}
            </StyledMessageList>
          </StyledChatContainer>
          <ChatInput onSend={addMessage} />
        </ChatArea>
      </ChatLayout>
  );
};

export default ChatPage;