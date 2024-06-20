// 고객센터
// src/pages/CustomerService.jsx

import { useParams } from "react-router-dom";

const CustomerService = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">고객센터</h1>
      <div className="mb-4">
        <label className="block mb-1">이름</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">성</label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
        </div>
          <div className="mb-4">
            <label className="block mb-1">아이디</label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">이메일 주소</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
    </div>
  );
}

export default CustomerService;
