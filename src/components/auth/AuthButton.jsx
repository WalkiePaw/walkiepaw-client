import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { logout } from '../../store/AuthSlice.jsx';
import default_user from '../../assets/default_user.png';
import styled from 'styled-components';

const StyledAuthButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    padding: 0.5rem 1rem;
    color: #4a4a4a;
    border-radius: 0.375rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e8c5a5;
    }
  }

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
`;


const AuthButton = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
      <StyledAuthButton>
        {isLoggedIn ? (
            <>
              <img src={default_user} alt="user" />
              <button onClick={handleLogout}>로그아웃</button>
            </>
        ) : (
            <button>
              <Link to="/login">로그인</Link>
            </button>
        )}
      </StyledAuthButton>
  );
};

export default AuthButton;