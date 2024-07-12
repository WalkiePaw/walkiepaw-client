import styled from 'styled-components';
import pawpaw from '../../assets/pawpaw.png';
import React from "react";

/**
 * 회원가입 페이지의 레이아웃을 담당하는 컴포넌트
 */

const AuthTemplateBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background-color: #f0f0f0;
    padding: 0; // 패딩 제거
`;

const AuthBox = styled.div`
    width: 100%;
    height: 100%; // 높이를 화면 전체로 설정
    max-width: 100%; // 최대 너비 제한 해제
    padding: 2rem;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    font-family: 'TTLaundryGothicB';
    font-size: 2rem;
    margin: 0 1rem; // 타이틀과 이미지 사이의 간격 설정
`;

const AuthTemplate = ({ children }) => {
    return (
        <AuthTemplateBlock>
            <AuthBox>
                <TitleContainer>
                    <img src={pawpaw} alt="발바닥로고" style={{ height: '4rem' }} />
                    <Title>회원가입</Title>
                    <img src={pawpaw} alt="발바닥로고" style={{ height: '4rem' }} />
                </TitleContainer>
                {children}
            </AuthBox>
        </AuthTemplateBlock>
    );
};

export default AuthTemplate;
