// src/moduels/Kakao.jsx

import React, { useEffect } from 'react';

const { kakao } = window;

const KakaoMap = ({ setLocation }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.56598487731902, 126.97537315669699),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);

    // 지도 클릭 이벤트 리스너 등록
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      const latLng = mouseEvent.latLng;
      setLocation(`${latLng.getLat()}, ${latLng.getLng()}`);
    });

    return () => {
      kakao.maps.event.clearInstanceListeners(map);
    };
  }, [setLocation]);

  return <div id="map" style={{ width: '100%', height: '300px' }} />;
};

export default KakaoMap;
