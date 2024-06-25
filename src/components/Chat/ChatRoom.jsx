import React from 'react';
import styled from 'styled-components';
import { ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import default_user from '../../assets/default_user.png'


const SidebarContainer = styled.div`
  width: 300px;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const StyledConversation = styled(Conversation)`
  &:hover {
    background-color: #e8e8e8;
  }
`;

function ChatRoom() {
  return (
      <SidebarContainer>
        <ConversationList>
          <StyledConversation name="산책왕" lastSenderName="산책왕" info="평일 2시부터 5시까지 가능하신가요?">
            <Avatar  src={default_user} name="산책왕" />
          </StyledConversation>
          {/* 다른 대화 목록 항목들 */}
        </ConversationList>
      </SidebarContainer>
  );
}

export default ChatRoom;