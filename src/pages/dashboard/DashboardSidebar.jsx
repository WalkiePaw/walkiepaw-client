import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getProfileImage } from "../../util/profile-img";
import ImageUpload from "../../components/ImageUpload";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStar, faEdit } from '@fortawesome/free-solid-svg-icons';

const DashboardSidebar = ({ nickname }) => {
  const [memberData, setMemberData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    console.log(nickname);
    if (nickname) {
      axios.get(`http://localhost:8080/api/v1/members/${encodeURIComponent(nickname)}/dashboard`)
        .then(response => {
          setMemberData(response.data);
          if (response.data.member_photo) {
            setProfileImage(response.data.member_photo);
          } else {
            setProfileImage(getProfileImage(1));
          }
        })
        .catch((error) => {
          console.error("회원 정보를 가져오던 도중 오류 발생:", error);
        });
    } else {
      console.error('닉네임을 찾을 수 없음');
    }
  }, [nickname]);

  return (
    <div className="w-80 bg-gray-100 p-4 h-screen overflow-y-auto">
      <div className="text-center mt-5 mb-3">
        <ImageUpload
          initialImage={profileImage}
          readOnly={!!profileImage} 
        />
        <div className="mt-3 mb-5 text-xl font-bold">
          {memberData ? memberData.nickname : ''}
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow mb-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-500">산책</div>
            <div className="text-lg font-bold">{memberData ? memberData.recruitCount : 0}회</div>
          </div>
          <div>
            <div className="text-gray-500">알바</div>
            <div className="text-lg font-bold">{memberData ? memberData.researchCount : 0}</div>
          </div>
          <div>
            <div className="text-gray-500">리뷰 평균</div>
            <div className="text-lg font-bold text-yellow-500">★ {memberData ? memberData.score.toFixed(1) : '0.0'}</div>
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