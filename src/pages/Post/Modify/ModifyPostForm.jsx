import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ModifyPostForm.css';
import KakaoMap from '../../../modules/Kakao';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const ModifyPostForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPost = location.state?.post;
  const [post, setPost] = useState(initialPost);
  const [images, setImages] = useState(post.images || []);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setPost(initialPost);
    setImages(initialPost.images || []);
  }, [initialPost]);

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

    const modifiedPost = {
      ...post,
      images,
    };

    // 여기에 수정된 게시글을 저장하고 업데이트하는 로직을 추가할 수 있습니다.

    alert('게시글이 수정되었습니다.');

    navigate('/board-list');
  };

  const handlePlaceSelect = (address) => {
    setPost({
      ...post,
      location: address,
    });
  };

  return (
    <div className="modify-post-container">
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
      <form onSubmit={handleSubmit} className="modify-post-form">
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="제목을 입력하세요."
          required
        />
        <label htmlFor="priceType">가격:</label>
        <div className="price-buttons">
          <button
            type="button"
            className={`btn-price ${
              post.priceType === '시급' ? 'selected' : ''
            }`}
            onClick={() => setPost({ ...post, priceType: '시급' })}
          >
            시급
          </button>
          <button
            type="button"
            className={`btn-price ${
              post.priceType === '일급' ? 'selected' : ''
            }`}
            onClick={() => setPost({ ...post, priceType: '일급' })}
          >
            일급
          </button>
          <label>
            <input
              type="checkbox"
              checked={post.priceProposal}
              onChange={(e) =>
                setPost({ ...post, priceProposal: e.target.checked })
              }
            />
            가격 제안 받기
          </label>
        </div>
        <label htmlFor="price">금액:</label>
        <input
          type="price"
          className="price"
          value={post.price}
          onChange={(e) => setPost({ ...post, price: e.target.value })}
          placeholder="금액을 입력하세요."
        ></input>
        <label htmlFor="date">날짜 및 시간:</label>
        <input
          type="date"
          id="date"
          value={post.date}
          onChange={(e) => setPost({ ...post, date: e.target.value })}
          required
        />
        <div className="time-container">
          <input
            type="time"
            value={post.startTime}
            onChange={(e) => setPost({ ...post, startTime: e.target.value })}
            required
          />
          <span>~</span>
          <input
            type="time"
            value={post.endTime}
            onChange={(e) => setPost({ ...post, endTime: e.target.value })}
            required
          />
        </div>

        <label htmlFor="content">내용:</label>
        <textarea
          id="content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          rows="4"
          cols="50"
          required
        />
        <label htmlFor="location">만나는 장소:</label>
        <div className="location-container">
          <KakaoMap onSelectPlace={handlePlaceSelect} />
          <input type="text" id="location" value={post.location} readOnly />
          <input
            type="text"
            placeholder="상세주소를 입력하세요."
            value={post.detailedLocation}
            onChange={(e) =>
              setPost({ ...post, detailedLocation: e.target.value })
            }
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">
            수정 완료
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/board-list')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyPostForm;
