import React, { useState, useEffect, useRef } from 'react';
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
  top: calc(100% + 5px);  // 이미지 아래로 5px 간격을 둠
  right: 0;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  min-width: 120px;
  z-index: 1000;  // 다른 요소들 위에 표시되도록 z-index 추가
`;

const MenuItem = styled(motion.div)`
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;  // 추가: 텍스트가 한 줄로 유지되도록 함

  &:hover {
    background-color: #e8c5a5;
  }
`;

const WelcomeMessage = styled(motion.span)`
  margin-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  color: #4a4a4a;
`;



const AuthButton = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userRole = useSelector(state => state.auth.user?.authorities);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <StyledAuthButton ref={dropdownRef}>
        {isLoggedIn ? (
            <>
              <img
                  src={default_user}
                  alt="user"
                  onClick={toggleDropdown}
              />
              <AnimatePresence>
                {user && (
                    <WelcomeMessage
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                      {user.nickname}님 반갑습니다!
                    </WelcomeMessage>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isOpen && (
                    <DropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                  <MenuItem onClick={() => { navigate('/mypage/settings'); setIsOpen(false); }}>
                    마이페이지
                  </MenuItem>
                  {userRole === 'ADMIN' && (
                    <MenuItem onClick={() => { navigate('/admin'); setIsOpen(false); }}>
                      관리자 페이지
                    </MenuItem>
                  )}
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