// MyPage.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import MyHistory from "./MyHistory";
import MyInformation from "./MyInformation";
import MembershipWithdrawal from "./MembershipWithdrawal";
import CustomerService from "./CustomerService";
import MySettings from "./MySettings";
import MyPageLayout from "./MyPageLayout";
import MyReview from "./MyReview";

const MyPage = () => {
  return (
      <Routes>
        <Route path="/MySettings" element={<MySettings />} />
        <Route path="/MyHistory" element={<MyHistory />} />
        <Route path="/MyReview" element={<MyReview />} />
        <Route path="/MyInformation" element={<MyInformation />} />
        <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
        <Route path="/CustomerService" element={<CustomerService />} />
      </Routes>
  );
};

export default MyPage;
