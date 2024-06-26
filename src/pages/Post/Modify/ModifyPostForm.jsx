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
import axios from 'axios';

const ModifyPostForm = () => {
  const location = useLocation(); // 현재 위치 정보를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 함수입니다.
  const initialPost = location.state?.post; // 수정할 게시글의 초기 데이터를 가져옵니다.
  const [post, setPost] = useState(initialPost); // 게시글 정보를 상태로 관리합니다.
  const [images, setImages] = useState(post.images || []); // 게시글의 이미지를 상태로 관리합니다.
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스를 상태로 관리합니다.

  // 게시글 정보가 변경 업데이트
  useEffect(() => {
    setPost(initialPost);
    setImages(initialPost.images || []);
  }, [initialPost]);

  // 이미지 업로드 처리 함수
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // 파일들을 배열로 정리
    const newImages = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // 파일을 읽은 후 결과를 반환
        reader.onerror = reject;
        reader.readAsDataURL(file); // 파일 데이터를 URL로 읽음
      });
    });

    // 모든 사진 파일을 읽은 후 이미지를 추가
    Promise.all(newImages).then((results) => {
      setImages([...images, ...results]);
    });
  };

  // 다음 사진 슬라이드를 표시하는 함수
  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === Math.floor((images.length - 1) / 4) ? 0 : prevSlide + 1
    );
  };

  // 이전 사진 슬라이드를 표시하는 함수
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? Math.floor((images.length - 1) / 4) : prevSlide - 1
    );
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 페이지가 새로고침되는 걸 막아요.

    // 수정된 게시글 정보를 생성
    const modifiedPost = {
      ...post, // 기존 게시글의 모든 속성을 복사합니다.
      images,
      priceType: post.priceType === '시급' ? 'HOURLY' : 'DAILY',
      price: parseInt(post.price),
      startTime: new Date(post.startDate).toISOString(), // IOS 형식으로 변환
      endTime: new Date(post.endDate).toISOString(), // IOS 형식으로 변환
    };

    try {
      const response = await axios.patch(
        'http://localhost:8080/api/v1/boards/${post.Id}',
        modifiedPost,
        {
          headers: {
            ContentType: 'application/json',
          },
        }
      );

      console.log('서버 응답', response);

      if (response === 201) {
        alert('게시글이 수정되었습니다.');
        navigate('/board-list');
      } else {
        throw new Error('게시글 수정 실패!');
      }
    } catch (error) {
      console.error('Error', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  // 지도에서 선택한 장소를 처리하는 함수
  const handlePlaceSelect = (address) => {
    setPost({
      ...post, // 기존 게시글의 모든 속성을 복사합니다.
      location: address,
    });
  };

  // 수정 폼 렌더링
  return (
    <div className="modify-post-container">
      {/* 이미지 업로드 영역 */}
      <div className="image-upload">
        {/* 사진 올리기 버튼 */}
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
      {/* 게시글 수정 폼 */}
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
        <div className="datetime-container">
          <label htmlFor="startDate">날짜 및 시간:</label>
          <div className="datetime-inputs">
            <input
              type="datetime-local"
              id="startDate"
              value={post.startDate}
              onChange={(e) => setPost({ ...post, startDate: e.target.value })}
              required
            />
            <span style={{ margin: '0 40px' }}> ~ </span>
            <input
              type="datetime-local"
              id="endDate"
              value={post.endDate}
              onChange={(e) => setPost({ ...post, endDate: e.target.value })}
              required
            />
          </div>
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
          <button type="submit" className="md-submit-button">
            수정 완료
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

// 컴포넌트를 내보내서 다른 곳에서도 사용할 수 있게 합니다.
export default ModifyPostForm;
