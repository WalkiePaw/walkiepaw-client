import React from "react";
import { NavLink } from "react-router-dom";
import { getProfileImage } from "./../util/profile-img";
// fontawesome: 이모지 적용
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

const MyPageLayout = ({ children }) => (

  <div className="flex h-screen">
    <style>
      {`
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
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />
              내 동네 설정
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MyHistory"
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />
              내 작성글
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MyReview"
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />              
              내 거래 내역
            </NavLink>
          </li>
        </ul>
        <h3 className="font-bold mt-4">나의 정보</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/MyInformation"
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />
              회원 정보 수정
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/MembershipWithdrawal"
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />
              회원 탈퇴
            </NavLink>
          </li>
        </ul>
        <h3 className="font-bold mt-4">고객센터</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/CustomerService"
              className="text-black hover:text-orange-300"
              activeClassName="text-orange-600"
            >
              <FontAwesomeIcon icon={faGripLines} style={{ marginRight: '0.5rem' }} />
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
