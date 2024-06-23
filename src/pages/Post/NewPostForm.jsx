import React, { useState } from 'react';
import KakaoMap from '../../modules/Kakao';
import './NewPostForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('시급');
  const [priceProposal, setPriceProposal] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((results) => {
      setImages([...images, ...results]);
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === Math.floor((images.length - 1) / 4) ? 0 : prevSlide + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? Math.floor((images.length - 1) / 4) : prevSlide - 1
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 작성 완료 버튼 처리 로직 추가
  };

  const handlePlaceSelect = (address) => {
    setLocation(address);
  };

  const handlePriceTypeClick = (type) => {
    setPriceType(type);
  };

  return (
    <div className="new-post-container">
      <div className="image-upload">
        <label htmlFor="image-upload" className="image-upload-button">
          <FontAwesomeIcon icon={faCamera} style={{ height: '100%' }} />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {images.length > 0 && (
          <div className="image-slider">
            <button className="prev-button" onClick={handlePrevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="image-preview-container">
              {images
                .slice(currentSlide * 4, currentSlide * 4 + 4)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded Preview ${index}`}
                    className="image-preview"
                  />
                ))}
            </div>
            <button className="next-button" onClick={handleNextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
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
        <label htmlFor="priceType">가격:</label>
        <div className="price-buttons">
          <button
            type="button"
            className={`btn-price ${priceType === '시급' ? 'selected' : ''}`}
            onClick={() => handlePriceTypeClick('시급')}
          >
            시급
          </button>
          <button
            type="button"
            className={`btn-price ${priceType === '일급' ? 'selected' : ''}`}
            onClick={() => handlePriceTypeClick('일급')}
          >
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
        </div>
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
          <KakaoMap onSelectPlace={handlePlaceSelect} />
          <input type="text" id="location" value={location} readOnly />
          <input type="text" placeholder="상세주소를 입력하세요." />
        </div>
        <button type="submit" className="submit-button">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
