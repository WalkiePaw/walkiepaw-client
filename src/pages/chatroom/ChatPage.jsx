import React from 'react';
import styled from 'styled-components';
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
  margin-top: 1rem;
  height: 100%;
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
  padding: 10px;
`;

const StyledMessageInput = styled(MessageInput)`
  border-top: 1px solid #e0e0e0;
`;

function ChatPage() {
  return (
      <ChatLayout>
        <ChatRoom />
        <ChatArea>
          <StyledChatContainer>
            <StyledConversationHeader>
              <Avatar src="path_to_golden_retriever.jpg" name="골댕이" />
              <ConversationHeader.Content userName="골댕이" info="안읽은 메세지만 보기" />
            </StyledConversationHeader>
            <MessageList>
              <Message model={{
                message: "안녕하세요 ~~~~",
                sentTime: "오후 3:44",
                sender: "산책왕",
                direction: "incoming",
                position: "single"
              }}>
                <Avatar src="path_to_avatar_image.jpg" name="산책왕" />
              </Message>
              <Message model={{
                message: "안녕하세요. 산책합니다",
                sentTime: "오후 3:46",
                sender: "골댕이",
                direction: "outgoing",
                position: "single"
              }} />
              {/* 추가 메시지들 */}
            </MessageList>
          </StyledChatContainer>
          <ChatInput>

          </ChatInput>
        </ChatArea>

      </ChatLayout>
  );
}

export default ChatPage;