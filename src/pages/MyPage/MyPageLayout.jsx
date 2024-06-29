import React from 'react';
import { Outlet } from 'react-router-dom';
import MyPageSidebar from './MyPageSidebar';

const MyPageLayout = () => (
  <div className="flex h-screen">
    <style>
      {`
        .active {
          color: orange;  
        }
      `}
    </style>
    <MyPageSidebar />
    <main className="flex-1 p-4 bg-white">
      <Outlet />
    </main>
  </div>
);

export default MyPageLayout;
