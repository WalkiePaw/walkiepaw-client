import React from 'react';

const MemberList = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-5">회원 목록 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">번호</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">이름</th>
              <th className="px-4 py-2 border-b">닉네임</th>
              <th className="px-4 py-2 border-b">가입일자</th>
              <th className="px-4 py-2 border-b">신고횟수</th>
              <th className="px-4 py-2 border-b">상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b">43</td>
              <td className="px-4 py-2 border-b">test123@test.com</td>
              <td className="px-4 py-2 border-b">user</td>
              <td className="px-4 py-2 border-b">산책왕</td>
              <td className="px-4 py-2 border-b">2024-03-05</td>
              <td className="px-4 py-2 border-b">10</td>
              <td className="px-4 py-2 border-b">정지</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
