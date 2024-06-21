// src/pages/MyTown.jsx

import { useState } from "react";
import MyPageLayout from "./MyPageLayout";

const MyTown = () => {
  const [selectedRegion, setSelectedRegion] = useState(""); // State to hold selected region
  const [selectedDistrict, setSelectedDistrict] = useState(""); // State to hold selected district

  // Define the list of regions and districts
  const regions = {
    서울: ["강남구", "강동구", "강북구", "강서구"],
    경기: ["수원시", "성남시", "용인시", "안양시"],
    인천: ["중구", "동구", "미추홀구", "연수구"],
    부산: ["중구", "서구", "동구", "남구"]
    // Add more regions and districts as needed
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedDistrict(""); // Reset district selection when region changes
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  return (
    <MyPageLayout>
      <div>
        <h1 className="font-bold text-2xl mb-4">지역 선택</h1>

        {/* Region Dropdown */}
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

        {/* District Dropdown */}
        {selectedRegion && (
          <div className="mb-4">
            <label className="block mb-1">구/군</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">선택하세요</option>
              {regions[selectedRegion].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Display selected region and district */}
        {selectedRegion && selectedDistrict && (
          <p className="mb-4">
            선택된 지역: {selectedRegion} {selectedDistrict}
          </p>
        )}
      </div>
    </MyPageLayout>
  );
}

export default MyTown;
