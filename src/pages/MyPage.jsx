// MyPage.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import MyHistory from "../pages/MyHistory";
import MyInformation from "../pages/MyInformation";
import MembershipWithdrawal from "../pages/MembershipWithdrawal";
import CustomerService from "../pages/CustomerService";
import MySettings from "../pages/MySettings";
import MyPageLayout from "./MyPageLayout";
import MyReview from "./MyReview";

const MyPage = () => {
  return (
    <MyPageLayout>
      <Routes>
        <Route path="/MySettings" element={<MySettings />} />
        <Route path="/MyHistory" element={<MyHistory />} />
        <Route path="/MyReview" element={<MyReview />} />
        <Route path="/MyInformation" element={<MyInformation />} />
        <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
        <Route path="/CustomerService" element={<CustomerService />} />
      </Routes>
    </MyPageLayout>
  );
};

export default MyPage;
