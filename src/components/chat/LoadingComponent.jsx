import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F5E6D3;
`;

const LoadingIcon = styled(FontAwesomeIcon)`
  color: #43312A;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const LoadingText = styled.h2`
  color: #43312A;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: #E8C5A5;
  font-size: 2rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingComponent = ({ message = "로딩 중..." }) => {
  return (
      <LoadingContainer>
        <LoadingIcon icon={faPaw} />
        <LoadingText>{message}</LoadingText>
        <SpinnerIcon icon={faSpinner} />
      </LoadingContainer>
  );
};

export default LoadingComponent;