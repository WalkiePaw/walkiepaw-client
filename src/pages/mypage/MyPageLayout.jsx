import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MyPageSidebar from './MyPageSidebar';

const MyPageLayout = () => {

  return (
    <div className="flex h-screen">
      <MyPageSidebar/>
      <div className={"flex-1 overflow-auto"}>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
