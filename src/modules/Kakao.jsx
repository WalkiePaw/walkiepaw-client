import React, { useEffect, useRef, useState } from 'react';

const { kakao } = window;

const KakaoMap = ({ setLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [placesList, setPlacesList] = useState([]);
  const [infowindow, setInfowindow] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    };

    const mapInstance = new kakao.maps.Map(container, options);
    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });

    setMap(mapInstance);
    setInfowindow(infowindowInstance);
  }, []);

  const searchPlaces = (keyword) => {
    const ps = new kakao.maps.services.Places();

    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  const displayPlaces = (places) => {
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];

    removeAllMarkers();
    setPlacesList(places);

    places.forEach((place) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      const marker = new kakao.maps.Marker({
        position: placePosition,
        map,
      });

      newMarkers.push(marker);
      bounds.extend(placePosition);

      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(
          '<div style="padding:5px;">' + place.place_name + '</div>'
        );
        infowindow.open(map, marker);
      });
    });

    map.setBounds(bounds);
    setMarkers(newMarkers);
  };

  const removeAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  return (
    <div>
      <div style={{ position: 'relative', height: '400px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: '1',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 6px rgba(0,0,0,0.1)',
          }}
        >
          <input
            type="text"
            id="keyword"
            placeholder="검색할 장소를 입력하세요"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={() =>
              searchPlaces(document.getElementById('keyword').value)
            }
            style={{ padding: '5px 10px' }}
          >
            검색
          </button>
        </div>
      </div>
      <ul
        style={{
          listStyleType: 'none',
          padding: '10px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {placesList.map((place, index) => (
          <li key={index} style={{ margin: '5px 0', cursor: 'pointer' }}>
            <span>{place.place_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KakaoMap;
