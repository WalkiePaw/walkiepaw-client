// src/pages/MySettings.jsx
import MyPageKakaoMap from "../../modules/MyPageKakao";
import { useState } from "react";

const MyTown = () => {
  const [location, setLocation] = useState("");
  return (
    <div>
      <h1 className="font-bold text-3xl mb-3">지역 선택</h1>
      <div className="location-container">
        <MyPageKakaoMap setLocation={setLocation} />
      </div>
    </div>
  );
};

export default MyTown;
