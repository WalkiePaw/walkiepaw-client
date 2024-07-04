import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  width: 100%;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    transform: translateY(-100%);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <footer className="w-full text-center py-2 shadow-md">
          <h3 className="my-1">© 2024 Bitcamp, Inc.</h3>
          <p className="my-1">
              개인정보처리방침 이용약관 사이트맵 회사 세부정보 위치기반서비스 이용약관 이용자보호 비전과 계획 청소년보호정책
          </p>
          <p className="my-1">고객센터 : 02-xxxx-xxxx, bitcamp@test.com </p>
      </footer>
    </FooterWrapper>
  );
};

export default Footer;
