// 고객센터
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
// axios 임포트
import axios from "axios";
// 팝업창, 모달: sweetalert 적용
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// 아이콘: font-awesome 적용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

const CustomerService = () => {
  const { id } = useOutletContext(); // id를 context에서 가져옵니다.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (id) {
      try {
        const response = await axios.post("http://57.180.244.228:8000/api/v1/qna", {
          title,
          content,
          memberId: id, // context에서 가져온 id 사용
        });

        if (response.status === 201) {
          MySwal.fire({
            title: "제출이 완료되었습니다",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            setTitle("");
            setContent("");
          });
        }
      } catch (error) {
        MySwal.fire({
          title: "오류가 발생했습니다",
          text: "다시 시도해 주세요.",
          icon: "error",
          confirmButtonText: "확인",
        });
        console.error("There was an error adding the QnA!", error);
      }
    } else {
      MySwal.fire({
        title: "오류",
        text: "로그인이 필요합니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">고객센터</h1>
      <div
        className="p-3 mb-5 bg-white rounded-lg border-2"
        style={{ borderColor: "#FFA7A7" }}
      >
        <h2 className="text-2xl font-bold mb-3">🔔 1:1 문의</h2>
        <div className="flex items-center mb-2">
          <h2 className="font-bold">온라인 보안 팁:</h2>
        </div>
        <p className="mb-6">
          고객님의 보안 유지를 위해, 개인정보나 신용카드 정보를 전화, 이메일,
          채팅 등으로 공유하는 행위는 절대 삼가시기 바랍니다.
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-6">
        <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
        도움이 필요하신가요?
      </h2>
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
        <div className="text-right items-center justify-between">
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
