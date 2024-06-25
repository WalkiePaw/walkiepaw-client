// 고객센터
// src/pages/CustomerService.jsx

import React, { useState } from "react";
// 팝업창, 모달: sweetalert 적용
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// 아이콘: font-awesome 적용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

const CustomerService = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // 문의사항 제출 시 SweetAlert2 팝업창
    MySwal.fire({
      title: "제출이 완료되었습니다",
      icon: "success",
      confirmButtonText: "확인",
    }).then(() => {
      // Reset form fields after alert is confirmed
      setTitle("");
      setContent("");
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">고객센터</h1>
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faCircleInfo} className="text-orange-500 mr-2" />
        <h2 className="font-bold">온라인 보안 팁</h2>
      </div>
      <p className="mb-6">
        고객님의 보안 유지를 위해, 개인정보나 신용카드 정보를 전화, 이메일, 채팅
        등으로 공유하는 행위는 절대 삼가시기 바랍니다.
      </p>
      <h2 className="text-2xl font-bold mb-6">도움이 필요하신가요?</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="내용을 입력하세요"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#43312A] hover:bg-[#43312A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerService;
