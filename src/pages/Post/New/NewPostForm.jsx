import React, { useState } from 'react';
import KakaoMap from '../../../modules/Kakao';
import './NewPostForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('시급');
  const [price, setPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState(''); // 지도의 위치와 주소
  const [images, setImages] = useState([]);
  const [detailedLocation, setDetailedLocation] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [category, setCategory] = useState('JOB_OPENING');

  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const memberId = parseInt(localStorage.getItem('memberId')); // 로그인한 사용자의 ID를 가져옵니다.
    const memberId = 1;

    const newPost = {
      title,
      priceType: priceType === '시급' ? 'HOURLY' : 'DAILY',
      price: parseInt(price), // 금액을 정수로 변환
      startTime: new Date(startTime).toISOString(), // ISO 형식으로 변환
      endTime: new Date(endTime).toISOString(), // ISO 형식으로 변환
      content,
      // location,
      // detailedLocation,
      // images,
      memberId,
      category: category === '산책' ? 'JOB_OPENING' : 'JOB_SEARCH',
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/boards',
        newPost,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('서버 응답:', response);

      if (response?.status === 201) {
        alert('게시글 저장 완료!');
        navigate(`/recruit${category === 'JOB_OPENING' ? '' : '1'}`);
      } else {
        throw new Error('게시글 저장 실패!');
      }
    } catch (error) {
      console.error('Error', error);
      alert('게시글 저장에 실패했습니다.');
    }
  };

  const handlePlaceSelect = (address) => {
    setLocation(address);
  };

  const handlePriceTypeClick = (type) => {
    setPriceType(type);
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
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
      <div className="category-buttons">
        <button
          type="button"
          className={`btn-category ${category === '산책' ? 'selected' : ''}`}
          onClick={() => handleCategoryClick('산책')}
        >
          산책
        </button>
        <button
          type="button"
          className={`btn-category ${category === '알바' ? 'selected' : ''}`}
          onClick={() => handleCategoryClick('알바')}
        >
          알바
        </button>
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
        </div>
        <label htmlFor="price">금액:</label>
        <input
          type="number"
          className="price"
          placeholder="금액을 입력하세요."
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label htmlFor="startTime">날짜 및 시간:</label>
        <div className="datetime-container">
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <span style={{ margin: '0 40px' }}>~</span>
          <input
            type="datetime-local"
            id="endTime"
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
          <input
            type="text"
            placeholder="상세주소를 입력하세요."
            value={detailedLocation}
            onChange={(e) => setDetailedLocation(e.target.value)}
          />
        </div>
        <button type="submit" className="post-submit-button">
          작성 완료
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
