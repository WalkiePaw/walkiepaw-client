import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import AuthButton from '../../src/components/auth/AuthButton'; //
import { useSelector } from 'react-redux';

const HeaderContainer = styled.header`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  z-index: 50;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'TTLaundryGothicB';

  .container {
    display: flex;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px; // 또는 원하는 최대 너비
    padding: 0 1rem; // 작은 화면에서 최소한의 여백 유지
  }

  nav {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
  }
  
  img {
    height: 3rem;
    max-width: 100%;
    object-fit: contain;
  }

  nav {
    flex-grow: 1;
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    color: #4a4a4a;
    border-radius: 0.375rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e8c5a5;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: row;
      align-items: center;
      max-width: 100%;
      gap: 1rem; /* 요소들 사이 간격 */
    }

    nav {
      order: 1; /* 네비게이션을 아래로 이동 */
      width: 100%; /* 전체 너비로 확장 */
      margin-top: 1rem; /* 로고에서의 간격 */
    }

    .buttons {
      order: 3; /* 버튼들을 아래로 이동 */
      margin-top: 1rem; /* 네비게이션에서의 간격 */
    }

    img {
      height: 2.5rem; /* 작은 화면에 맞게 크기 조정 */
    }

    nav ul {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;

const Menus = styled.ul`
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  li {
    a {
      transition: color 0.3s;

      &.active {
        color: #007bff;
      }

      &:hover {
        color: #007bff;
      }
    }
  }

  @media (max-width: 768px) {
    align-items: center;
    flex-direction: column;
    gap: 0.75rem;
  }
`;


const Header = () => {

  return (
    <HeaderContainer>
      <div className="container">
        <NavLink to="/" className="flex-shrink-0">
          <img src={logo} alt="Logo"/>
        </NavLink>

        <nav>
          <Menus>
            <li>
              <NavLink to="/recruit" activeClassName="active">
                산책인 모집글
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" activeClassName="active">
                알바 구직글
              </NavLink>
            </li>
            <li>
              <NavLink to="/chatpage" activeClassName="active">
                채팅
              </NavLink>
            </li>
          </Menus>
        </nav>

        <div className="buttons">
          <AuthButton/>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default Header;
