import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

// Global style for @font-face
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'HancomMalangMalang-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2406-1@1.0/HancomMalangMalang-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }

  body {
    margin: 0;
    font-family: 'HancomMalangMalang-Regular', sans-serif;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  min-height: 100vh; 
`;
const HomeBoxWrapper = styled.div`
  width: 100%; /* Ensure HomeBoxWrapper spans full width */
  background-color: ${(props) => props.bgColor};

  @media (min-width: 768px) {
    padding: 20px; /* Adjust padding for larger screens */
  }
`;

const HomeBoxContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* Center items horizontally */
  padding: 20px;
  box-sizing: border-box;
  max-width: 800px; /* Limit content width */
  margin: 0 auto; /* Center align content */

  @media (min-width: 768px) {
    flex-direction: row; /* Adjust to row layout for larger screens */
  }
`;

const TopBox = styled.div`
  flex: 1;
  text-align: left;

  @media (min-width: 768px) {
    text-align: left; /* Adjust text alignment for larger screens */
  }
`;

const TextBox = styled.div`
  text-align: left;
  font-family: 'HancomMalangMalang-Regular', sans-serif;

  @media (min-width: 768px) {
    text-align: left; /* Adjust text alignment for larger screens */
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 300px; 
`;

const Button = styled.button`
  margin-top: 10px;
  border: none;
  border-radius: 10px; 
  display: block;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  position: relative;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  background-color: #6d4c41;
  padding: 15px 50px;
  margin: 20px auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 490%;
    width: 140%;
background-color: rgba(208, 147, 109, 0.8); 
    transition: all 0.5s ease-in-out;
    transform: translateX(-98%) translateY(-25%) rotate(45deg);
  }

  &:hover:after {
    opacity: 1;
    transform: translateX(-9%) translateY(-25%) rotate(45deg);
  }
`;

const TypingAnimation = styled.div`
  display: inline-block;
  overflow: hidden;
  animation: typing 4s steps(20, end), blink-caret 0.5s step-end infinite;
  white-space: nowrap;

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: black }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/jobs");
  };

  return (
    <Root>
      <GlobalStyle />
      <HomeBoxWrapper bgColor="#e8c5a5">
        <HomeBoxContent>
          <TopBox>
            <TypingAnimation>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "HancomMalangMalang-Regular",
                }}
              >
                반려견과 함께하는 즐거운 산책
              </h2>
            </TypingAnimation>
            <p style={{ fontSize: "18px" }}>
              워키포우와 함께 최고의 산책 파트너를 찾아보세요!
            </p>
          </TopBox>
          <Image src="img/feeding.png" alt="homeImg" />
        </HomeBoxContent>
      </HomeBoxWrapper>
      <HomeBoxWrapper bgColor="#f0e8e0">
        <HomeBoxContent>
          <Image src="img/walking2.png" alt="homeImg" />
          <TextBox>
            <TypingAnimation>
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                산책인 모집
              </h2>
            </TypingAnimation>
            <p style={{ fontSize: "18px" }}>믿을만한 이웃 산책인 구하기</p>
            <Link to="/recruit">
              <Button>
                <span>내 근처 산책인 찾기</span>
              </Button>
            </Link>
          </TextBox>
        </HomeBoxContent>
      </HomeBoxWrapper>
      <HomeBoxWrapper bgColor="#ebffed">
        <HomeBoxContent>
          <TextBox>
            <TypingAnimation>
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                알바 • 구직
              </h2>
            </TypingAnimation>
            <p style={{ fontSize: "18px" }}>반려견과 교감하며 즐겁게 일하기</p>
            <Button as="button" onClick={handleClick}>
              <span>내 근처 알바 찾기</span>
            </Button>
          </TextBox>
          <Image src="img/moneyjar.png" alt="homeImg" />
        </HomeBoxContent>
      </HomeBoxWrapper>
    </Root>
  );
};

export default Home;