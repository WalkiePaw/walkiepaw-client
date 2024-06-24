import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import default_user from '../assets/default_user.png'

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
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    margin: 0 auto;
    max-width: 1200px;
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
      flex-direction: column;
      align-items: flex-start;
    }

    .buttons {
      margin-top: 1rem;
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
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const UserIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const Header = ({ children }) => {
  const { isLoggedIn, logout } =  0;
  // useAuth();

  return (
      <HeaderContainer>
        <div className="container">
          <NavLink to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" />
          </NavLink>

          <nav>
            <Menus>
              <li>
                <NavLink to="/hire" activeClassName="active">
                  산책
                </NavLink>
              </li>
              <li>
                <NavLink to="/work" activeClassName="active">
                  알바
                </NavLink>
              </li>
              <li>
                <NavLink to="/chat" activeClassName="active">
                  채팅
                </NavLink>
              </li>
            </Menus>
          </nav>


          <div className="buttons">
            {isLoggedIn ? (
                <>
                  <img src={default_user} alt="user" />
                  <button onClick={logout}>로그아웃</button>
                </>
            ) : (
                <button>
                  <Link to="/login">로그인</Link>
                </button>
            )}
          </div>
        </div>
      </HeaderContainer>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;