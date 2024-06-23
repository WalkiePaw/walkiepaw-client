import React, { useState } from 'react';
import KakaoMap from '../../modules/Kakao';
import './NewPostForm.css';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('시급');
  const [priceProposal, setPriceProposal] = useState(false);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 작성 완료 버튼 처리 로직 추가
  };

  const handlePlaceSelect = (address) => {
    setLocation(address);
  };

  return (
    <div className="new-post-container">
      <div className="image-upload">
        <label htmlFor="image-upload" className="image-upload-button">
          사진 이미지
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className="image-preview-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Uploaded Preview ${index}`}
              className="image-preview"
            />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="new-post-form">
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          required
        />
        <label htmlFor="priceType">가격 종류:</label>
        <button type="button" className="btn-price-hour">
          시급
        </button>
        <button type="button" className="btn-price-day">
          일급
        </button>
        <label>
          <input
            type="checkbox"
            checked={priceProposal}
            onChange={(e) => setPriceProposal(e.target.checked)}
          />
          가격 제안 받기
        </label>
        <label htmlFor="price">금액:</label>
        <input
          type="price"
          className="price"
          placeholder="금액을 입력하세요."
        ></input>
        <label htmlFor="date">날짜 및 시간:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <div className="time-container">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <span>~</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <label htmlFor="content">내용:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          cols="50"
          required
        />
        <label htmlFor="location">만나는 장소:</label>
        <div className="location-container">
          <input type="text" id="location" value={location} readOnly />
          <KakaoMap onSelectPlace={handlePlaceSelect} />
        </div>
        <button type="submit" className="submit-button">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
