import React, { useEffect, useRef, useState } from 'react';
import './Kakao.css'; // Add this line to import the CSS file

const KakaoMap = ({ onSelectPlace }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [markers, setMarkers] = useState([]);

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
        onSelectPlace(place.road_address_name || place.address_name);
      });

      itemEl.onmouseover = () => {
        displayInfowindow(marker, place.place_name);
      };

      itemEl.onmouseout = () => {
        infowindow.close();
      };

      itemEl.onclick = () => {
        onSelectPlace(place.road_address_name || place.address_name);
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

  return (
    <div>
      <div style={{ position: 'relative', height: '400px' }}>
        <div
          id="map"
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
        ></div>
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
          <button onClick={searchPlaces} style={{ padding: '5px 10px' }}>
            검색
          </button>
        </div>
      </div>
      <ul
        id="placesList"
        className="places-list" // Add this class for styling
      ></ul>
      <div id="pagination" className="pagination"></div>
    </div>
  );
};

export default KakaoMap;
