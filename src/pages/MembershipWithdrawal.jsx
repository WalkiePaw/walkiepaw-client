// 회원 탈퇴
// src/pages/MembershipWithdrawal.jsx

import { useParams } from "react-router-dom";
import MyPageLayout from "./MyPageLayout";

const MembershipWithdrawal = () => {
  return (
    <MyPageLayout>
      <div>
        <form className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">
            본인 확인을 위해 비밀번호를 다시 입력해주세요.
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
              type="button"
              className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none"
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
