// src/pages/MyTown.jsx
import { useState } from 'react';
import './MyTown.css';

const MyTown = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const regions = {
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
    // Add more regions, districts, and neighborhoods as needed
  };
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedDistrict(''); // 구 리셋하기
    setSelectedNeighborhood(''); // 동 리셋하기
  };
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedNeighborhood(''); // 동 리셋하기
  };
  const handleNeighborhoodChange = (e) => {
    const neighborhood = e.target.value;
    setSelectedNeighborhood(neighborhood);
  };
  return (
    <div className="flex">
      <h1 className="font-bold text-2xl mb-4">지역 선택</h1>
      <div className="mb-4">
        <label className="block mb-1">시/도</label>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">선택하세요</option>
          {Object.keys(regions).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      {selectedRegion && (
        <div className="mb-4">
          <label className="block mb-1">시군구</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {Object.keys(regions[selectedRegion]).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedDistrict && (
        <div className="mb-4">
          <label className="block mb-1">동/읍/면</label>
          <select
            value={selectedNeighborhood}
            onChange={handleNeighborhoodChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {regions[selectedRegion][selectedDistrict].map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
export default MyTown;
