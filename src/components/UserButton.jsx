import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px;
  border: 1px solid #43312A;
  border-radius: 4px;
  background-color: #43312A;
  cursor: pointer;
  margin-bottom: 16px; /* Adds space between inputs */
  width: 75%;
  box-sizing: border-box;
  color: white;

  &:disabled {
    background-color: #E8C5A5;
    cursor: not-allowed;
  }
`;

const UserButton = ({ text, onClick, disabled }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

export default UserButton;
