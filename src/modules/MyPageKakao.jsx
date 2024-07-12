import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;

const Map = styled.div`
  width: 100%;
  height: 100%;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

const KeywordInput = styled.input`
  margin-right: 10px;
  padding: 5px;
`;

const PlacesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  max-height: 200px;
  overflow-y: auto;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const MyPageKakaoMap = ({ setLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        const infowindowInstance = new window.kakao.maps.InfoWindow({
          zIndex: 1,
        });
        setMap(mapInstance);
        setInfowindow(infowindowInstance);
      }
    };

    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=bcc85e56b4e6da53a218658cd336c213&libraries=services';
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, []);

  const searchPlaces = () => {
    const keyword = document.getElementById('keyword').value.trim();

    if (!keyword) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB, { size: 5 });
  };

  const placesSearchCB = (data, status, pagination) => {
    if (status === window.kakao.maps.services.Status.OK) {
      displayPlaces(data);
      displayPagination(pagination);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
    }
  };

  const displayPlaces = (places) => {
    const listEl = document.getElementById('placesList');
    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers = [];

    removeAllChildNods(listEl);
    removeMarkers();

    places.forEach((place, index) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, index);
      const itemEl = getListItem(index, place);

      bounds.extend(placePosition);

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        displayInfowindow(marker, place.place_name);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        handleSelectPlace(place.road_address_name || place.address_name);
      });

      itemEl.onmouseover = () => {
        displayInfowindow(marker, place.place_name);
      };

      itemEl.onmouseout = () => {
        infowindow.close();
      };

      itemEl.onclick = () => {
        handleSelectPlace(place.road_address_name || place.address_name);
      };

      newMarkers.push(marker);
      listEl.appendChild(itemEl);
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const addMarker = (position, idx) => {
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
      offset: new window.kakao.maps.Point(13, 37),
    };
    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(map);
    return marker;
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const getListItem = (index, place) => {
    const el = document.createElement('li');
    el.className = 'item'; // Add this class for styling
    el.innerHTML = `
      <span class="markerbg marker_${index + 1}"></span>
      <div class="info">
        <h5>${place.place_name}</h5>
        ${
          place.road_address_name
            ? `<span>${place.road_address_name}</span><span class="jibun gray">${place.address_name}</span>`
            : `<span>${place.address_name}</span>`
        }
        <span class="tel">${place.phone}</span>
      </div>
    `;
    return el;
  };

  const displayPagination = (pagination) => {
    const paginationEl = document.getElementById('pagination');
    const fragment = document.createDocumentFragment();

    while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild(paginationEl.lastChild);
    }

    for (let i = 1; i <= pagination.last; i++) {
      const el = document.createElement('a');
      el.href = '#';
      el.innerHTML = i;

      if (i === pagination.current) {
        el.className = 'on';
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  };

  const displayInfowindow = (marker, title) => {
    const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };

  const removeAllChildNods = (el) => {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  };

  const handleSelectPlace = (placeName) => {
    // Check if the place is already selected
    if (selectedPlaces.some((place) => place === placeName)) {
      alert('이미 선택된 장소입니다.');
      return;
    }

    setSelectedPlaces((prev) => [...prev, placeName]);
    setLocation(placeName); // Update parent component state
  };

  const handleClearSelectedPlaces = () => {
    setSelectedPlaces([]);
  };
  return (
    <MapContainer>
      <Map id="map" ref={mapRef}></Map>
      <SearchContainer className="search-container">
        <KeywordInput
          type="text"
          id="keyword"
          placeholder="검색할 장소를 입력하세요"
        />
        <button onClick={searchPlaces}>검색</button>
      </SearchContainer>
      <PlacesList id="placesList" className="places-list"></PlacesList>
      <Pagination id="pagination" className="pagination"></Pagination>
      <div>
        <h2 className='text-xl font-bold'>선택된 장소: </h2>
        <ul>
          {selectedPlaces.map((place, index) => (
            <li key={index}>{place}</li>
          ))}
        </ul>
        <button onClick={handleClearSelectedPlaces}>선택 초기화</button>
      </div>
    </MapContainer>
  );
};

export default MyPageKakaoMap;
