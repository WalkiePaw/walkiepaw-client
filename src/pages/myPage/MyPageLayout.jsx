import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MyPageSidebar from './MyPageSidebar';
// FontAwesome 임포트 - 사이드 바 열고 닫는 기능(보류)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const MyPageLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <MyPageSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 p-4 bg-white transition-all duration-300 
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        md:ml-0 md:pl-${isSidebarOpen ? '64' : '0'}`}
      >
        {/* <button 
          className="fixed top-4 left-4 z-50 text-black" 
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faArrowLeft : faArrowRight} size="2x" />
        </button> */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
