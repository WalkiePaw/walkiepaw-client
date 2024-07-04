import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatRoom from '../../components/Chat/ChatRoom.jsx';
import ChatInput from '../../components/Chat/ChatInput.jsx';


const ChatLayout = styled.div`
  display: flex;
  margin-top: 0.1rem;
  height: auto;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledChatContainer = styled(ChatContainer)`
  height: 100%;
`;

const StyledConversationHeader = styled(ConversationHeader)`
  background-color: #f0f0f0;
  //padding: 10px;
`;

const StyledMessageInput = styled(MessageInput)`
  border-top: 1px solid #e0e0e0;
`;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);

  useEffect(() => {
    if (selectedChatroomId) {
      axios.get(`http://localhost:8080/api/v1/chats?chatroomId=${selectedChatroomId}`)
      .then(response => {
        console.log(response.data);
        const formattedMessages = response.data.map(msg => ({
          message: msg.content,
          sentTime: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.senderNickname,
          direction: msg.senderId === 1 ? "outgoing" : "incoming", // 1은 현재 사용자의 ID로 가정
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

  const addMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, {
      message: newMessage,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "나",
      direction: "outgoing",
      position: "single"
    }]);
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
            <MessageList>
              {messages.map((msg, index) => (
                  <Message key={index} model={msg}>
                    {msg.direction === "incoming" && <Avatar src="path_to_avatar_image.jpg" name={msg.sender} />}
                  </Message>
              ))}
            </MessageList>
          </StyledChatContainer>
          <ChatInput onSend={addMessage} />
        </ChatArea>
      </ChatLayout>
  );
}

export default ChatPage;