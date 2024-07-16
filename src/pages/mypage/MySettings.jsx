import React, { useState } from 'react';
import MyPageKakaoMap from '../../modules/MyPageKakao';
import { useDispatch } from 'react-redux';
import { setSelectedPlaces } from '../../store/selectedPlaceSlice';
const MySettings = () => {
  const [location, setLocation] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const dispatch = useDispatch();

  const handleSetLocation = (placeName) => {
    if (selectedPlaces.length < 4 && !selectedPlaces.includes(placeName)) {
      const newSelectedPlaces = [...selectedPlaces, placeName];
      setSelectedPlaces(newSelectedPlaces);
      dispatch(setSelectedPlaces(newSelectedPlaces)); // Redux 상태 업데이트
    }
  };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-3">지역 선택</h1>
      <div className="location-container">
        <MyPageKakaoMap setLocation={handleSetLocation} />
      </div>
      <ul>
          {selectedPlaces.map((place, index) => (
            <li key={index}>{place}</li>
          ))}
        </ul>
    </div>
  );
};

export default MySettings;
