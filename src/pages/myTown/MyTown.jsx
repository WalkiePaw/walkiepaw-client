import { useState } from 'react';
import './MyTown.css';

const MyTown = ({ onSiChange, onGuChange, onDongChange }) => {
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  const si = {
    서울: {
      강남구: ['역삼동', '개포동', '청담동'],
      강동구: ['천호동', '성내동', '암사동'],
      강북구: ['미아동', '번동', '수유동'],
      강서구: ['화곡동', '등촌동', '방화동'],
    },
    경기: {
      수원시: ['장안구', '팔달구', '영통구'],
      성남시: ['분당구', '수정구', '중원구'],
      용인시: ['수지구', '기흥구', '처인구'],
      안양시: ['동안구', '만안구'],
    },
    인천: {
      중구: ['도원동', '영종도'],
      동구: ['송림동', '화수동'],
      미추홀구: ['주안동', '도화동'],
      연수구: ['송도동', '옥련동'],
    },
    부산: {
      중구: ['부평동', '남포동'],
      서구: ['동대신동', '부민동'],
      동구: ['좌천동', '초량동'],
      남구: ['대연동', '용호동'],
    },
    // 시, 구, 동을 더 추가 할 수 있음
  };

  const handleSiChange = (e) => {
    const si = e.target.value;
    setSelectedSi(si);
    setSelectedGu(''); // 구 리셋하기
    setSelectedDong(''); // 동 리셋하기
    onSiChange(si);
  };

  const handleGuChange = (e) => {
    const gu = e.target.value;
    setSelectedGu(gu);
    setSelectedDong(''); // 동 리셋하기
    onGuChange(gu);
  };

  const handleDongChange = (e) => {
    const dong = e.target.value;
    setSelectedDong(dong);
    onDongChange(dong);
  };

  return (
    <div className="flex">
      <h1 className="font-bold text-2xl" style={{ alignContent: 'center' }}>
        지역 선택
      </h1>
      {/* 시/도 선택 옵션 */}
      <div className="mb-4">
        <label className="block mb-1">시/도</label>
        <select
          value={selectedSi}
          onChange={handleSiChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">선택하세요</option>
          {/* 시/도 옵션들을 맵으로 출력 */}
          {Object.keys(si).map((si) => (
            <option key={si} value={si}>
              {si}
            </option>
          ))}
        </select>
      </div>
      {/* 시군구 선택 옵션 */}
      {selectedSi && (
        <div className="mb-4">
          <label className="block mb-1">시군구</label>
          <select
            value={selectedGu}
            onChange={handleGuChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {/* 선택된 시/도에 따른 시군구 옵션들을 맵으로 출력 */}
            {Object.keys(si[selectedSi]).map((gu) => (
              <option key={gu} value={gu}>
                {gu}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* 동/읍/면 선택 옵션 */}
      {selectedGu && (
        <div className="mb-4">
          <label className="block mb-1">동/읍/면</label>
          <select
            value={selectedDong}
            onChange={handleDongChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {/* 선택된 시/도, 시군구에 따른 동/읍/면 옵션들을 맵으로 출력 */}
            {si[selectedSi][selectedGu].map((dong) => (
              <option key={dong} value={dong}>
                {dong}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MyTown;
