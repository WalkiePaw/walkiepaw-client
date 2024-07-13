import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/AuthSlice.jsx';
import default_user from '../../assets/default_user.png';
import styled from 'styled-components';

const StyledAuthButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    padding: 0.5rem 1rem;
    color: #4a4a4a;
    border-radius: 0.375rem;
    transition: background-color 0.3s;
    white-space: nowrap;  // 추가: 텍스트가 한 줄로 유지되도록 함

    &:hover {
      background-color: #e8c5a5;
    }
  }

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  min-width: 120px;  // 추가: 최소 너비 설정
`;

const MenuItem = styled(motion.div)`
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;  // 추가: 텍스트가 한 줄로 유지되도록 함

  &:hover {
    background-color: #e8c5a5;
  }
`;


const AuthButton = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
      <StyledAuthButton>
        {isLoggedIn ? (
            <>
              <img
                  src={default_user}
                  alt="user"
                  onClick={toggleDropdown}
              />
              <AnimatePresence>
                {isOpen && (
                    <DropdownMenu
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                      <MenuItem onClick={() => navigate('/mypage')}>
                        마이페이지
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        로그아웃
                      </MenuItem>
                    </DropdownMenu>
                )}
              </AnimatePresence>
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