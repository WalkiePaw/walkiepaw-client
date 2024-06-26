// src/modules/KakaoWithoutSearch.js
import React, { useEffect } from 'react';

const KakaoWithoutSearch = ({ defaultAddress }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=39540ea4b1e5f4b36c10411338099411&libraries&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(defaultAddress, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
            map.setCenter(coords);
          }
        });
      });
    };

    return () => script.remove();
  }, [defaultAddress]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default KakaoWithoutSearch;
