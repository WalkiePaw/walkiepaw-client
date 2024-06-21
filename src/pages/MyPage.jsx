// MyPage.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import MyTown from "../pages/MyTown";
import MyHistory from "../pages/MyHistory";
import MyInformation from "../pages/MyInformation";
import MembershipWithdrawal from "../pages/MembershipWithdrawal";
import CustomerService from "../pages/CustomerService";
import MySettings from "../pages/MySettings";
import MyPageLayout from "./MyPageLayout";

const MyPage = () => {
  return (
    <MyPageLayout>
      <Routes>
        <Route path="/MySettings" element={<MySettings />} />
        <Route path="/MyTown" element={<MyTown />} />
        <Route path="/MyHistory" element={<MyHistory />} />
        <Route path="/MyInformation" element={<MyInformation />} />
        <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
        <Route path="/CustomerService" element={<CustomerService />} />
      </Routes>
    </MyPageLayout>
  );
};

export default MyPage;
