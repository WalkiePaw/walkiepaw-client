import React, { useState, useEffect } from 'react';
import WebSocket from '../../components/chat/WebSocket.jsx'
import styled from 'styled-components';
import axios from 'axios';
import { ChatContainer, MessageList, Message, Avatar, ConversationHeader } from '@chatscope/chat-ui-kit-react'; // 올바른 컴포넌트만 import
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatRoom from '../../components/chat/ChatRoom.jsx'; // 경로 확인
import ChatInput from '../../components/chat/ChatInput.jsx';
import {useSelector} from "react-redux"; // 경로 확인

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
  const user = useSelector(state => state.auth.user);  // 전체 user 객체 가져오기
  const id = user?.id;  // Optional chaining을 사용하여 id 값 안전하게 접근

  const { subscribe, send, unsubscribe } = WebSocket('http://localhost:8080/ws');

  useEffect(() => {
    if (selectedChatroomId) {
    //   // 이전 구독 해제
    //   unsubscribe(`/topic/chatroom/${selectedChatroomId}`);

      // 채팅 메시지 히스토리 로드
      axios
      .get(`http://localhost:8080/api/v1/chats?chatroomId=${selectedChatroomId}`)
      .then((response) => {
        console.log(response.data);
        const formattedMessages = response.data.map((msg) => ({
          message: msg.content,
          sentTime: new Date(msg.createDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.nickname,
          direction: msg.writerId === id ? 'outgoing' : 'incoming',
          position: 'single',
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => {
        console.error('Error fetching chat messages:', error);
      });

      // 새 채팅방 구독
      subscribe(`/chats/${selectedChatroomId}`, (message) => {
        setMessages(prevMessages => [...prevMessages, {
          message: message.content,
          sentTime: new Date(message.createDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: message.nickname,
          direction: message.writerId === id ? 'outgoing' : 'incoming',
          position: 'single',
        }]);
      });
    }

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (selectedChatroomId) {
        unsubscribe(`/topic/chatroom/${selectedChatroomId}`);
      }
    };
  }, [selectedChatroomId, subscribe, unsubscribe, id]);

  const handleChatroomSelect = (chatroomId) => {
    setSelectedChatroomId(chatroomId);
  };

  const addMessage = async (newMessage) => {
    if (!selectedChatroomId) {
      console.error('No chatroom selected');
      return;
    }

    const chatAddRequest = {
      content: newMessage,
      chatroomId: selectedChatroomId,
      writerId: id,
    };

    send("/api/v1/chats", chatAddRequest);

    // 로컬 상태 업데이트 (optional)
    setMessages(prevMessages => [
      ...prevMessages,
      {
        message: newMessage,
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: '나',
        direction: 'outgoing',
        position: 'single',
        writerId: id,
      },
    ]);
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
                {msg.direction === 'incoming' && <Avatar src="path_to_avatar_image.jpg" name={msg.sender} />}
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
