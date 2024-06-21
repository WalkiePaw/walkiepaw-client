import React, { useState } from 'react';
import './NewPostForm.css';
import KakaoMap from '../../moduels/Kakao';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('일급');
  const [priceProposal, setPriceProposal] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);

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

  return (
    <div className="new-post-container">
      <div className="image-upload">
        <label htmlFor="image-upload" className="image-upload-button">
          첨부 이미지
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className="image-list">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image} alt={`첨부 이미지 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>가격:</label>
        <div className="price-buttons">
          <button
            type="button"
            className={priceType === '일급' ? 'selected' : ''}
            onClick={() => setPriceType('일급')}
          >
            일급
          </button>
          <button
            type="button"
            className={priceType === '시급' ? 'selected' : ''}
            onClick={() => setPriceType('시급')}
          >
            시급
          </button>
        </div>
        <label>
          <input
            type="checkbox"
            checked={priceProposal}
            onChange={(e) => setPriceProposal(e.target.checked)}
          />
          가격 제안 받기
        </label>
        <label htmlFor="date">날짜 및 시간:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="시간"
          required
        />
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
          <KakaoMap setLocation={setLocation} />
        </div>
        <button type="submit" className="submit-button">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
