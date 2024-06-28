// MyPage.jsx

import React from "react";
import MyPageLayout from "./MyPageLayout";
import { Outlet } from "react-router-dom";

const MyPage = () => {
  return (
    <MyPageLayout>
    <Outlet />
  </MyPageLayout>
  );
};

export default MyPage;
