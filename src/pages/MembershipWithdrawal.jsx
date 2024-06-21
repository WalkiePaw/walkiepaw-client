// 회원 탈퇴
// src/pages/MembershipWithdrawal.jsx

import { useParams } from "react-router-dom";
import MyPageLayout from "./MyPageLayout";
// 팝업창, 모달: sweetalert 적용
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// fontawesome: 이모지 적용
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';

const MembershipWithdrawal = () => {
  // 비밀번호 인증 후 띄울 모달창
  const MySwal = withReactContent(Swal);

  const handleSubmit = (e) => {
    e.preventDefault();

    MySwal.fire({
      title: "정말 탈퇴하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "회원 탈퇴하기",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "탈퇴되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
      }
    });
  };

  return (
    <MyPageLayout>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">
            본인 확인을 위해 비밀번호를 다시 입력해주세요 .
            <FontAwesomeIcon icon={faFaceSadTear} className="text-danger mr-2" />
          </h1>
          <div className="mb-4">
            <label className="block mb-1">비밀번호</label>
            <div className="flex space-x-4">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">비밀번호 재입력</label>
            <div className="flex space-x-4">
              <input
                type="password"
                name="password-recheck"
                placeholder="비밀번호"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[#43312A] text-white rounded-md focus:outline-none"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </MyPageLayout>
  );
};

export default MembershipWithdrawal;
