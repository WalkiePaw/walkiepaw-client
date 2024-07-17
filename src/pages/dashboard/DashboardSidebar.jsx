import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { getProfileImage } from "../../util/profile-img";
import ImageUpload from "../../components/ImageUpload";

const DashboardSidebar = ({ nickname }) => {
  const [memberData, setMemberData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log('nickname:', nickname);
    if (nickname) {
      axios.get(`http://localhost:8080/api/v1/members/${encodeURIComponent(nickname)}/dashboard`)
        .then(response => {
          setMemberData(response.data);
          setMemberId(response.data.memberId); // memberId로 변경
          console.log('memberId set:', response.data.memberId); // 로그 추가
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
  
  // memberId 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('Current memberId:', memberId);
  }, [memberId]);

  return (
    <div className="w-80 bg-gray-100 p-4 h-screen overflow-y-auto">
      <div className="text-center mt-5 mb-3">
        <ImageUpload initialImage={profileImage} readOnly={!!profileImage} />
        <div className="mt-3 mb-5 text-xl font-bold">
          {memberData ? memberData.nickname : ""}
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow mb-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-500">산책</div>
            <div className="text-lg font-bold">
              {memberData ? memberData.recruitCount : 0}회
            </div>
          </div>
          <div>
            <div className="text-gray-500">알바</div>
            <div className="text-lg font-bold">
              {memberData ? memberData.researchCount : 0}회
            </div>
          </div>
          <div>
            <div className="text-gray-500">리뷰 평균</div>
            <div className="text-lg font-bold text-yellow-500">
              ★ {memberData ? memberData.score.toFixed(1) : "0.0"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mb-5">
        <h1 className="text-xl font-bold mt-3 mb-3">{"\"소개\""}</h1>
          <p className="p-4 bg-white rounded-lg border border-gray-300 text-sm w-full">
            {memberData && memberData.profile ? memberData.profile : '소개가 없습니다.'}
          </p>
      </div>
    </div>
  );
}

export default DashboardSidebar;