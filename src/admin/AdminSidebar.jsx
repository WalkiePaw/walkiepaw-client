// 관리자페이지 사이드바
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  return (
    <div className="w-80 h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FontAwesomeIcon icon={faUserTie} className="mr-2" />
        관리자 페이지
      </h1>
      <ul>
        <li className="mb-2 text-lg">
          <NavLink to="/admin/member-list" className="text-gray-700">
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            회원 목록
          </NavLink>
        </li>
        <li className="mb-2 text-lg">
          <NavLink to="/admin/member-report" className="text-gray-700">
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            회원 신고
          </NavLink>
        </li>
        <li className="mb-2 text-lg">
          <NavLink to="/admin/board-report" className="text-gray-700">
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            게시판 신고
          </NavLink>
        </li>
        <li className="mb-2 text-lg">
          <NavLink to="/admin/cs-mngmt" className="text-gray-700">
            <FontAwesomeIcon
              icon={faGripLines}
              style={{ marginRight: "0.5rem" }}
            />
            문의 관리
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
