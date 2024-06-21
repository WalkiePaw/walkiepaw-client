import React from "react";
import { NavLink } from "react-router-dom";
import { getProfileImage } from "./../util/profile-img";

const MyPageLayout = ({ children }) => (

  <div className="flex h-screen">
    <style>
      {`
        .text-orange-600 {
          color: orange;
        }
        .text-orange-600:hover, .text-orange-600.active {
          color: orange;
        }
        .active {
          color: orange;  
        }
      `}
    </style>
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
            <NavLink
              to="/MySettings"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              내 동네 설정
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MyTown"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              동네 인증하기
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MyHistory"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              모아보기
            </NavLink>
          </li>
        </ul>
        <h3 className="font-bold mt-4">나의 정보</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/MyInformation"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              회원 정보 수정
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MembershipWithdrawal"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              회원 탈퇴
            </NavLink>
          </li>
        </ul>
        <h3 className="font-bold mt-4">고객센터</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/CustomerService"
              className="text-black hover:text-orange-600"
              activeClassName="text-orange-600"
            >
              1:1 문의
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main className="flex-1 p-4 bg-white">
      {children}
    </main>
  </div>
);

export default MyPageLayout;
