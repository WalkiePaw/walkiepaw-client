import React from "react";
import { getProfileImage } from "./../util/profile-img";
import { Routes, Route, Link } from "react-router-dom";
import MyTown from "../pages/MyTown";
import MyHistory from "../pages/MyHistory";
import MyInformation from "../pages/MyInformation";
import MembershipWithdrawal from "../pages/MembershipWithdrawal";
import CustomerService from "../pages/CustomerService";
import MySettings from "../pages/MySettings";

const MyPage = () => {

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 p-4 bg-gray-100">
        <div className="text-center mb-4">
          <img
            src={getProfileImage(1)}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto bg-gray-300"
          />
          <div className="mt-2 font-bold">홍길동</div>
        </div>
        <nav>
          <h3 className="font-bold mt-4">나의 활동</h3>
          <ul className="mt-2">
            <li className="my-2">
              <Link to="/MySettings" className="text-blue-600 hover:underline">내 동네 설정</Link>
            </li>
            <li className="my-2">
              <Link to="/MyTown" className="text-blue-600 hover:underline">동네 인증하기</Link>
            </li>
            <li className="my-2">
              <Link to="/MyHistory" className="text-blue-600 hover:underline">모아보기</Link>
            </li>
          </ul>
          <h3 className="font-bold mt-4">나의 정보</h3>
          <ul className="mt-2">
            <li className="my-2">
              <Link to="/MyInformation" className="text-blue-600 hover:underline">회원 정보 수정</Link>
            </li>
            <li className="my-2">
              <Link to="/MembershipWithdrawal" className="text-blue-600 hover:underline">회원 탈퇴</Link>
            </li>
          </ul>
          <h3 className="font-bold mt-4">고객센터</h3>
          <ul className="mt-2">
            <li className="my-2">
              <Link to="/CustomerService" className="text-blue-600 hover:underline">1:1 문의</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 bg-white">
        <Routes>
          <Route path="/MySettings" element={<MySettings />} />
          <Route path="/MyTown" element={<MyTown />} />
          <Route path="/MyHistory" element={<MyHistory />} />
          <Route path="/MyInformation" element={<MyInformation />} />
          <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
          <Route path="/CustomerService" element={<CustomerService />} />
        </Routes>
      </main>
    </div>
  );
};

export default MyPage;
