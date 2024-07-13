import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyPageSidebar from './MyPageSidebar';

const MyPageLayout = () => {
  const user = useSelector(state => state.auth.user);  // 전체 user 객체 가져오기
  const id = user?.id;  // Optional chaining을 사용하여 id 값 안전하게 접근


  return (
    <div className="flex h-screen">
      <MyPageSidebar id={id} />
      <div className={"flex-1 overflow-auto"}>
        <main className="p-8">
          <Outlet context={{ id }} />
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
