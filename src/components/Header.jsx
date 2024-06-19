// src/components/Header.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({ children }) => {
  return (
    <header className="fixed top-0 left-0 w-full py-4 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-4 w-full">
          <img src={logo} alt="Logo" className="h-12 max-w-full object-contain" />

          <nav className="flex-grow">
            <ul className="flex justify-center space-x-6">
              <li>
                <NavLink
                  to="/"
                  className="text-gray-700 hover:text-blue-500 transition duration-300"
                  activeClassName="text-blue-500"
                >
                  산책
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/work"
                  className="text-gray-700 hover:text-blue-500 transition duration-300"
                  activeClassName="text-blue-500"
                >
                  알바
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chat"
                  className="text-gray-700 hover:text-blue-500 transition duration-300"
                  activeClassName="text-blue-500"
                >
                  채팅
                </NavLink>
              </li>
            </ul>
          </nav>

          {children}

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-800 rounded-md hover:bg-[#E8C5A5] transition duration-300">
              회원가입
            </button>
            <button className="px-4 py-2 text-gray-800 rounded-md hover:bg-[#E8C5A5] transition duration-300">
              로그인
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;