// 마이페이지 사이드바
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// 프로필 기본 이미지
import { getProfileImage } from "../../util/profile-img";
// 프로필 사진이 있는 경우
import ImageUpload from "../../components/ImageUpload";
// fontAwesome 아이콘 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
// axios 임포트
import axios from "axios";

  const MyPageSidebar = ({ id }) => {
    const [memberData, setMemberData] = useState(null);
    const [score, setScore] = useState(0);
    const [counts, setCounts] = useState({ recruitCount: 0, researchCount: 0 });
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
      if (id) {  // id가 존재할 때만 API 호출
        axios
        .get(`http://57.180.244.228:8000/api/v1/members/${id}`)
        .then((response) => {
          setMemberData(response.data);
          if (response.data.photo) {
            setProfileImage(response.data.photo);
          } else {
            setProfileImage(getProfileImage(1));
          }
        })
        .catch((error) => {
          console.error("회원 정보를 가져오던 도중 오류 발생:", error);
        });

        axios
        .get(`http://57.180.244.228:8000/api/v1/members/${id}/score`)
        .then((response) => {
          console.log('Score:', response.data);
          setScore(response.data.score);
        })
        .catch((error) => {
          console.error("평점 정보를 가져오던 도중 오류 발생:", error);
        });

        axios
        .get(`http://57.180.244.228:8000/api/v1/members/${id}/RRCount`)
        .then((response) => {
          console.log('Counts:', response.data);
          setCounts(response.data);
        })
        .catch((error) => {
          console.error("산책/알바 횟수 정보를 가져오던 도중 오류 발생:", error);
        });
      }
    }, [id]);  // id가 변경될 때마다 useEffect 실행


  return (
    <div className={"w-80 h-screen bg-gray-100 p-4"}>
      <div className="text-center mt-5 mb-3">
        <ImageUpload
          initialImage={profileImage}
          readOnly={!!profileImage} 
        />
        <div className="mt-3 mb-5 text-xl font-bold">
          {memberData ? memberData.nickname : ""}
        </div>
        <div className="p-4 bg-white rounded-lg shadow mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-500">산책</div>
              <div className="text-lg font-bold">{counts.recruitCount}회</div>
            </div>
            <div>
              <div className="text-gray-500">알바</div>
              <div className="text-lg font-bold">{counts.researchCount}회</div>
            </div>
            <div>
              <div className="text-gray-500">리뷰 평균</div>
              <div className="text-lg font-bold text-yellow-500">
                ★ {score.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <h3 className="font-bold mt-4">나의 활동</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/mypage/settings"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
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
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
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
              to="/mypage/transaction"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
            >
              <FontAwesomeIcon
                icon={faGripLines}
                style={{ marginRight: "0.5rem" }}
              />
              내 거래 내역
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/mypage/review"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
            >
              <FontAwesomeIcon
                icon={faGripLines}
                style={{ marginRight: "0.5rem" }}
              />
              내가 받은 리뷰
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/mypage/preferences"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
            >
              <FontAwesomeIcon
                icon={faGripLines}
                style={{ marginRight: "0.5rem" }}
              />
              내 관심 목록
            </NavLink>
          </li>
        </ul>
        <h3 className="font-bold mt-4">나의 정보</h3>
        <ul className="mt-2">
          <li className="my-2">
            <NavLink
              to="/mypage/information"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
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
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
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
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
            >
              <FontAwesomeIcon
                icon={faGripLines}
                style={{ marginRight: "0.5rem" }}
              />
              1:1 문의
            </NavLink>
          </li>
          <li className="my-2">
            <NavLink
              to="/mypage/qna-list"
              className={({ isActive }) => 
                `text-black hover:text-orange-300 ${isActive ? 'text-orange-300' : ''}`
              }
            >
              <FontAwesomeIcon
                icon={faGripLines}
                style={{ marginRight: "0.5rem" }}
              />
              내 문의 내역
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MyPageSidebar;
