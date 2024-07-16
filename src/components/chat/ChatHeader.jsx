import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComments } from "@fortawesome/free-solid-svg-icons";

const HeaderContainer = styled.div`
  background-color: #E8C5A5;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #D7B392;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 1.5rem;
  margin-right: 10px;
`;

const Title = styled.span`
  color: #43312A;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ChatIcon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 1.2rem;
`;

const ChatHeader = ({ boardTitle }) => {
  return (
      <HeaderContainer>
        <TitleContainer>
          <Icon icon={faPaw} />
          <Title>{boardTitle || '채팅방'}</Title>
        </TitleContainer>
        <ChatIcon icon={faComments} />
      </HeaderContainer>
  );
};

export default ChatHeader;