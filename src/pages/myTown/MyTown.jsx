import { useState, useEffect } from 'react';
import axios from 'axios';
import './MyTown.css';

const MyTown = ({ onSiChange, onGuChange, onDongChange }) => {
  const [siList, setSiList] = useState([]);
  const [guList, setGuList] = useState([]);
  const [dongList, setDongList] = useState([]);
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  // API 키 (실제 사용 시 환경변수로 관리하는 것이 좋습니다)
  const API_KEY = import.meta.env.VITE_VWORLD_API_KEY;

  useEffect(() => {
    fetchSiList();
  }, []);

  const fetchSiList = async () => {
    try {
      const response = await axios.get(`/vworld/req/data?service=data&request=GetFeature&data=LT_C_ADSIDO_INFO&key=${API_KEY}&domain=http://localhost:5173`);      
      setSiList(response.data.response.result.featureCollection.features);
    } catch (error) {
      console.error('Error fetching Si list:', error);
    }
  };

  const fetchGuList = async (siCode) => {
    try {
      const response = await axios.get(`/vworld/req/data?service=data&request=GetFeature&data=LT_C_ADSIDO_INFO&key=${API_KEY}&domain=http://localhost:5173`);      
      setGuList(response.data.response.result.featureCollection.features);
    } catch (error) {
      console.error('Error fetching Gu list:', error);
    }
  };

  const fetchDongList = async (guCode) => {
    try {
      const response = await axios.get(`/vworld/req/data?service=data&request=GetFeature&data=LT_C_ADSIDO_INFO&key=${API_KEY}&domain=http://localhost:5173`);      
      setDongList(response.data.response.result.featureCollection.features);
    } catch (error) {
      console.error('Error fetching Dong list:', error);
    }
  };

  const handleSiChange = (e) => {
    const si = e.target.value;
    setSelectedSi(si);
    setSelectedGu('');
    setSelectedDong('');
    fetchGuList(si.substr(0, 2));
    onSiChange(si);
  };

  const handleGuChange = (e) => {
    const gu = e.target.value;
    setSelectedGu(gu);
    setSelectedDong('');
    fetchDongList(gu.substr(0, 5));
    onGuChange(gu);
  };

  const handleDongChange = (e) => {
    const dong = e.target.value;
    setSelectedDong(dong);
    onDongChange(dong);
  };

  return (
    <div className="flex">
      <h1 className="font-bold text-2xl" style={{ alignContent: 'center' }}>
        지역 선택
      </h1>
      {/* 시/도 선택 옵션 */}
      <div className="mb-4">
        <label className="block mb-1">시/도</label>
        <select
          value={selectedSi}
          onChange={handleSiChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">선택하세요</option>
          {siList.map((si) => (
            <option key={si.properties.ctprvn_cd} value={si.properties.ctprvn_cd}>
              {si.properties.ctp_kor_nm}
            </option>
          ))}
        </select>
      </div>
      {/* 시군구 선택 옵션 */}
      {selectedSi && (
        <div className="mb-4">
          <label className="block mb-1">시군구</label>
          <select
            value={selectedGu}
            onChange={handleGuChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {guList.map((gu) => (
              <option key={gu.properties.sig_cd} value={gu.properties.sig_cd}>
                {gu.properties.sig_kor_nm}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* 동/읍/면 선택 옵션 */}
      {selectedGu && (
        <div className="mb-4">
          <label className="block mb-1">동/읍/면</label>
          <select
            value={selectedDong}
            onChange={handleDongChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">선택하세요</option>
            {dongList.map((dong) => (
              <option key={dong.properties.emd_cd} value={dong.properties.emd_cd}>
                {dong.properties.emd_kor_nm}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MyTown;
