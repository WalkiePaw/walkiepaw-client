import React, { useState } from 'react';
import MyPageKakaoMap from '../../modules/MyPageKakao';

const MyTown = () => {
  const [location, setLocation] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const handleSetLocation = (placeName) => {
    setLocation(placeName);
    setSelectedPlaces([...selectedPlaces, placeName]);
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

export default MyTown;
