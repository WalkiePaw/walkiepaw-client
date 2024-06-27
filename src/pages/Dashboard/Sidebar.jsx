// src/pages/Dashboard/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { getProfileImage } from "./../../util/profile-img";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStar, faEdit } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="w-80 h-screen bg-gray-100 p-4">
      <div className="text-center mb-8">
        <div className="text-center mt-5mb-3">
          <img
            src={getProfileImage(1)}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto bg-gray-300"
          />
          <div className="mt-3 mb-5 text-xl font-bold">홍길동</div>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow mb-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-500">산책</div>
            <div className="text-lg font-bold">82회</div>
          </div>
          <div>
            <div className="text-gray-500">알바</div>
            <div className="text-lg font-bold">428회</div>
          </div>
          <div>
            <div className="text-gray-500">리뷰 평균</div>
            <div className="text-lg font-bold text-yellow-500">★ 5.0점</div>
          </div>
        </div>
      </div>
      <ul className="space-y-4">
        <li>
          <Link
            to="/Dashboard"
            className="flex items-center space-x-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </Link>
        </li>
        <li>
          <Link
            to="/Dashboard/Review"
            className="flex items-center space-x-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faStar} />
            <span>리뷰</span>
          </Link>
        </li>
        <li>
          <Link
            to="/Dashboard/PostList"
            className="flex items-center space-x-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faEdit} />
            <span>게시글</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
