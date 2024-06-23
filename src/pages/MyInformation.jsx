// 내 정보 수정
// src/pages/MyInformation.jsx

import MyPageLayout from "./MyPageLayout";
// 팝업창, 모달: sweetalert 적용
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MyInformation = () => {
  // 회원정보 저장 후 띄울 모달창
  const MySwal = withReactContent(Swal);

  const handleSubmit = (e) => {
    e.preventDefault();
    MySwal.fire({
      title: "회원 정보를 저장했습니다",
      icon: "success",
      confirmButtonText: "확인",
    });
  };

  return (
    <MyPageLayout>
      <div className="max-h-screen overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">내 정보 수정</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">이름</label>
            <div className="flex space-x-4">
              <input
                type="text"
                name="lastName"
                placeholder="성"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="firstName"
                placeholder="이름"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">닉네임</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="nickname"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button type="button" className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none">
                중복확인
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">아이디</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="userid"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button type="button" className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none">
                중복확인
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">비밀번호</label>
            <button type="button" className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none">
              비밀번호 변경
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-1">이메일 주소</label>
            <div className="flex space-x-2">
              <input
                type="email"
                name="email"
                placeholder="xxxx@xxxx.com"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button type="button" className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none">
                인증
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">전화번호</label>
            <input
              type="tel"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">주소</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="address"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button type="button" className="px-4 py-2 bg-[#E8C5A5] text-black rounded-md focus:outline-none">
                검색
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">생년월일</label>
            <input
              type="date"
              name="birthdate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">사진</label>
            <input
              type="file"
              name="profileImage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#43312A] text-white rounded-md hover:bg-yellow-700"
            >
              저장
            </button>
          </div>
        </form>
        {/* 페이지 하단에 여백주기 */}
        <div className="mt-8 pb-8"></div> 
      </div>
    </MyPageLayout>
  );
}

export default MyInformation;