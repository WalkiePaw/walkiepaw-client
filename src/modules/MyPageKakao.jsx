import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import axios from 'axios';

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
  position: flex;
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
  margin-left: 5px;
  padding: 8px;
  border: 2px solid #599468;
  border-radius: 5px;

`;

const SearchButton = styled.button`
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ClearButton = styled.button`
  display: inline-block;
  padding: 5px 10px;
  margin-top: 10px;
  margin-right: 500px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  margin-left: 100px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;


const PlacesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  max-height: 200px;
  overflow-y: auto;
`;

const SelectedPlacesContainer = styled.div`
  margin-top: 20px;
`;

const SelectedPlacesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;

  li {
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  a {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #FFF;
    color: black;
    text-decoration: none;
    border-radius: 5px;
    cursor: pointer;

    &.on {
      background-color: #0056b3;
    }

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const MyPageKakaoMap = ({ setLocation, id}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }
  };

  useEffect(() => {
    const fetchSelectedAddresses = async () => {
      try {
        console.log('주소 데이터 요청 시작');
        const response = await axios.get(`http://localhost:8080/api/v1/members/${id}/addresses`);
        console.log('받은 응답:', response);
        
        console.log('response.data:', response.data);
        console.log('response.data.selectedAddrs:', response.data.selectedAddrs);
  
        if (response.data && response.data.selectedAddrs) {
          console.log('selectedAddrs 타입:', typeof response.data.selectedAddrs);
          
          if (typeof response.data.selectedAddrs === 'string') {
            const addresses = response.data.selectedAddrs.split(',');
            console.log('파싱된 주소:', addresses);
            setSelectedPlaces(addresses);
            setLocation(addresses); // 부모 컴포넌트 상태 업데이트
          } else {
            console.log('selectedAddrs가 문자열이 아닙니다.');
          }
        } else {
          console.log('선택된 주소가 없거나 데이터 형식이 잘못되었습니다.');
        }
      } catch (error) {
        console.error('선택된 주소를 가져오는데 실패했습니다:', error);
      }
    };
  
    fetchSelectedAddresses();
  }, [id]);


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
        handleSelectPlace(place);
      });

      itemEl.onmouseover = () => {
        displayInfowindow(marker, place.place_name);
      };

      itemEl.onmouseout = () => {
        infowindow.close();
      };

      itemEl.onclick = () => {
        handleSelectPlace(place);
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
    el.className = 'item';
    const parsedAddress = parseAddress(place.address_name);
    el.innerHTML = `
      <span class="markerbg marker_${index + 1}"></span>
      <div class="info">
        <h5>${place.place_name}</h5>
        <span>${parsedAddress}</span>
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

  const parseAddress = (address) => {
    const parts = address.split(' ');
    const city = parts[0];
    const gu = parts[1];
    const dong = parts[2];
    return `${city} ${gu} ${dong}`;
  };
  const handleSelectPlace = (place) => {
    const parsedAddress = parseAddress(place.address_name);
  
    setSelectedPlaces((prev) => {
      // 중복 체크
      const hasSameAddress = prev.includes(parsedAddress);
  
      if (prev.length >= 4) {
        Swal.fire({
          title: '장소 선택 제한',
          text: '최대 4개까지만 선택할 수 있습니다.',
          icon: 'warning',
          confirmButtonText: '확인',
        });
        return prev;
      }
  
      if (!hasSameAddress) {
        const updatedPlaces = [...prev, parsedAddress];
        setLocation(updatedPlaces); // 부모 컴포넌트 상태 업데이트
        return updatedPlaces;
      } else {
        Swal.fire({
          title: '이미 선택된 장소입니다.',
          text: '해당 장소는 이미 선택된 목록에 있습니다.',
          icon: 'warning',
          confirmButtonText: '확인',
        });
        return prev;
      }
    });
  };
  
  const handleRemovePlace = (indexToRemove) => {
    setSelectedPlaces((prev) => {
      const updatedPlaces = prev.filter((_, index) => index !== indexToRemove);
      setLocation(updatedPlaces); // 부모 컴포넌트 상태 업데이트
      return updatedPlaces;
    });
  };

  const handleClearPlaces = () => {
    if (selectedPlaces.length > 0) {
      Swal.fire({
        title: '선택 초기화',
        text: '이전에 선택한 장소를 모두 지우시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedPlaces([]);
        }
      });
    }
  };
  
  const handleSavePlaces = async () => {
    if (selectedPlaces.length === 0) {
      Swal.fire({
        title: '저장 실패',
        text: '선택된 장소가 없습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    }

  try {
    // 선택된 주소들을 문자열로 변환
    const addressesString = selectedPlaces.join(',');
    await axios.patch(`http://localhost:8080/api/v1/members/${id}/selected-addresses`, {
      selectedAddresses: addressesString
    });
    Swal.fire('성공', '선택한 장소가 저장되었습니다.', 'success');
    
    // 부모 컴포넌트 상태 업데이트
    setLocation(selectedPlaces);
  } catch (error) {
    console.error('장소 저장에 실패했습니다:', error);
    Swal.fire('오류', '장소 저장에 실패했습니다.', 'error');
  }
};

  return (
    <>
      <MapContainer>
        <SearchContainer>
          <KeywordInput
            type="text"
            id="keyword"
            onKeyDown={handleKeyDown}
            placeholder="주소를 입력하세요"
          />
          <SearchButton onClick={searchPlaces}>검색</SearchButton>
          <ClearButton onClick={handleClearPlaces}>선택 초기화</ClearButton>
          <SaveButton onClick={handleSavePlaces}>저장</SaveButton>
          <SelectedPlacesContainer>
        <h2 className='text-xl font-bold ml-2'>선택된 장소: </h2>
        <SelectedPlacesList>
              {selectedPlaces.map((place, index) => (
                <li key={index}>
                  {place}
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    X
                  </button>
                </li>
              ))}
        </SelectedPlacesList>
      </SelectedPlacesContainer>
          </SearchContainer>
        <Map ref={mapRef} id="map"></Map>
        <PlacesList id="placesList"></PlacesList>
        <Pagination id="pagination"></Pagination>
      </MapContainer>
    </>
  );
};

export default MyPageKakaoMap;
