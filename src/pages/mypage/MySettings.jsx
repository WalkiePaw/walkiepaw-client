import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MyPageKakaoMap from '../../modules/MyPageKakao';
import Swal from 'sweetalert2';
import axios from 'axios';

// Redux 액션 생성자 함수
const setSelectedPlacesAction = (places) => ({
  type: 'SET_SELECTED_PLACES',
  payload: places
});

const MySettings = () => {
  // console.log('MySettings 컴포넌트 렌더링');
  const { id } = useOutletContext();
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // 초기 데이터 로딩
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/members/${id}/addresses`);
        if (response.data && response.data.selectedAddresses) {
          setSelectedPlaces(response.data.selectedAddresses);
          dispatch(setSelectedPlacesAction(response.data.selectedAddresses));
        }
      } catch (error) {
        console.error('주소를 가져오는 데 실패했습니다:', error);
      }
    };
    fetchAddresses();
  }, [id, dispatch]);

  const handleSetLocation = (places) => {
    setSelectedPlaces(places);
    dispatch(setSelectedPlacesAction(places));
  };

  // const handleSavePlaces = async () => {
  //   try {
  //     // 선택된 주소들을 문자열로 변환
  //     const addressesString = selectedPlaces.join(',');
      
  //     await axios.patch(`http://localhost:8080/api/v1/members/${id}/selected-addresses`, {
  //       selectedAddresses: addressesString
  //     });
  //     Swal.fire('성공', '선택한 장소가 저장되었습니다.', 'success');
  //   } catch (error) {
  //     console.error('장소 저장에 실패했습니다:', error);
  //     Swal.fire('오류', '장소 저장에 실패했습니다.', 'error');
  //   }
  // };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-3">지역 선택</h1>
      <div className="location-container">
        <MyPageKakaoMap 
          setLocation={handleSetLocation} 
          initialPlaces={selectedPlaces}
          id={id} />
      </div>
    </div>
  );
};

export default MySettings;