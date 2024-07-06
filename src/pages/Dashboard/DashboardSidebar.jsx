// src/pages/Dashboard/DashboardSidebar.jsx

import React, { useEffect, useState } from 'react';
// axios 임포트
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getProfileImage } from "../../util/profile-img";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStar, faEdit } from '@fortawesome/free-solid-svg-icons';

const DashboardSidebar = () => {
  const [memberData, setMemberData] = useState(null);
  const [score, setScore] = useState(0);
  const [counts, setCounts] = useState({ recruitCount: 0, researchCount: 0 });

  useEffect(() => {
    const memberId = 1; // 로그인한 사용자의 ID를 가져옴

    if (memberId) {
      axios.get(`http://localhost:8080/api/v1/members/${memberId}`)
        .then(response => {
          setMemberData(response.data);
        })
        .catch(error => {
          console.error('회원 정보를 가져오던 도중 오류 발생:', error);
        });

      axios.get(`http://localhost:8080/api/v1/members/${memberId}/score`)
        .then(response => {
          setScore(response.data.score);
        })
        .catch(error => {
          console.error('평점 정보를 가져오던 도중 오류 발생:', error);
        });

      axios.get(`http://localhost:8080/api/v1/members/${memberId}/RRCount`)
        .then(response => {
          setCounts(response.data);
        })
        .catch(error => {
          console.error('산책/알바 횟수 정보를 가져오던 도중 오류 발생:', error);
        });
    } else {
      console.error('No user ID found in local storage.');
    }
  }, []);

  return (
    <div className="w-80 h-screen bg-gray-100 p-4">
      <div className="text-center mb-8">
        <div className="text-center mt-5mb-3">
          <img
            src={getProfileImage(1)}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto bg-gray-300"
          />
          <div className="mt-3 mb-5 text-xl font-bold">{memberData ? memberData.name : ''}</div>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow mb-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-500">산책</div>
            <div className="text-lg font-bold">{counts.recruitCount}회</div>
          </div>
          <div>
            <div className="text-gray-500">알바</div>
            <div className="text-lg font-bold">{counts.researchCount}</div>
          </div>
          <div>
            <div className="text-gray-500">리뷰 평균</div>
            <div className="text-lg font-bold text-yellow-500">★ {score.toFixed(1)}</div>
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

export default DashboardSidebar;
