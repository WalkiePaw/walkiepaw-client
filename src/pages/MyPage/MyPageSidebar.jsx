import React from "react";
import { NavLink } from "react-router-dom";
import { getProfileImage } from "./../../util/profile-img";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

const MyPageSidebar = () => (
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
            to="/mypage/settings"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            내 동네 설정
          </NavLink>
        </li>
        <li className="my-2">
          <NavLink
            to="/mypage/history"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            내 작성글
          </NavLink>
        </li>
        <li className="my-2">
          <NavLink
            to="/mypage/review"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            내 거래 내역
          </NavLink>
        </li>
      </ul>
      <h3 className="font-bold mt-4">나의 정보</h3>
      <ul className="mt-2">
        <li className="my-2">
          <NavLink
            to="/mypage/information"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            회원 정보 수정
          </NavLink>
        </li>
        <li className="my-2">
          <NavLink
            to="/mypage/withdrawal"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            회원 탈퇴
          </NavLink>
        </li>
      </ul>
      <h3 className="font-bold mt-4">고객센터</h3>
      <ul className="mt-2">
        <li className="my-2">
          <NavLink
            to="/mypage/customer-service"
            className="text-black hover:text-orange-300"
            activeClassName="text-orange-600"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            1:1 문의
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

export default MyPageSidebar;