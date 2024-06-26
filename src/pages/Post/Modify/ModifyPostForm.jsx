// 우리가 필요한 도구들을 가져와요.
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

// 게시글을 수정하는 특별한 공간을 만들어요.
const ModifyPostForm = () => {
  const location = useLocation(); // 우리가 어디 있는지, 어디로 갈지 알려주는 마법의 지도를 가져와요.
  const navigate = useNavigate();
  const initialPost = location.state?.post; // 원래 게시글 정보를 가져와요.
  const [post, setPost] = useState(initialPost); // 게시글 정보를 담을 특별한 상자를 만들어요.
  const [images, setImages] = useState(post.images || []); // 사진들을 담을 상자도 만들어요.
  const [currentSlide, setCurrentSlide] = useState(0); // 지금 보고 있는 사진이 몇 번째인지 기억하는 상자도 만들어요.

  // 게시글 정보가 바뀌면 우리의 상자도 같이 바꿔줘요.
  useEffect(() => {
    setPost(initialPost);
    setImages(initialPost.images || []);
  }, [initialPost]);

  // 새 사진을 올릴 때 어떻게 할지 정해요.
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // 사진들을 가져와서
    const newImages = files.map((file) => {
      // 하나씩 특별한 방법으로 바꿔요.
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    // 모든 사진이 바뀌면 우리의 사진 상자에 넣어줘요.
    Promise.all(newImages).then((results) => {
      setImages([...images, ...results]);
    });
  };

  // 다음 사진을 보고 싶을 때 어떻게 할지 정해요.
  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === Math.floor((images.length - 1) / 4) ? 0 : prevSlide + 1
    );
  };

  // 이전 사진을 보고 싶을 때 어떻게 할지 정해요.
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? Math.floor((images.length - 1) / 4) : prevSlide - 1
    );
  };

  // 게시글 수정이 끝났을 때 어떻게 할지 정해요.
  const handleSubmit = (event) => {
    event.preventDefault(); // 페이지가 새로고침되는 걸 막아요.

    // 수정된 게시글 정보를 모아요.
    const modifiedPost = {
      ...post,
      images,
    };

    // 여기에 수정된 게시글을 저장하는 마법 주문을 넣을 수 있어요.

    // 수정이 끝났다고 알려줘요.
    alert('게시글이 수정되었습니다.');

    // 게시글 목록으로 돌아가요.
    navigate('/board-list');
  };

  // 지도에서 장소를 선택했을 때 어떻게 할지 정해요.
  const handlePlaceSelect = (address) => {
    setPost({
      ...post,
      location: address,
    });
  };

  // 이제 우리가 만든 수정 공간을 보여줄 거예요.
  return (
    <div className="modify-post-container">
      {/* 사진을 올리는 공간 */}
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
        {/* 올린 사진들을 보여주는 공간 */}
        {images.length > 0 && (
          <div className="image-slider">
            {/* 이전 사진 보기 버튼 */}
            <button className="prev-button" onClick={handlePrevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {/* 사진들을 보여주는 공간 */}
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
            {/* 다음 사진 보기 버튼 */}
            <button className="next-button" onClick={handleNextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
      {/* 게시글 정보를 수정하는 공간 */}
      <form onSubmit={handleSubmit} className="modify-post-form">
        {/* 제목을 수정하는 공간 */}
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="제목을 입력하세요."
          required
        />
        {/* 가격 종류를 선택하는 공간 */}
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
          {/* 가격 제안 받기 선택하는 공간 */}
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
        {/* 금액을 입력하는 공간 */}
        <label htmlFor="price">금액:</label>
        <input
          type="price"
          className="price"
          value={post.price}
          onChange={(e) => setPost({ ...post, price: e.target.value })}
          placeholder="금액을 입력하세요."
        ></input>
        {/* 날짜와 시간을 입력하는 공간 */}
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

        {/* 내용을 수정하는 공간 */}
        <label htmlFor="content">내용:</label>
        <textarea
          id="content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          rows="4"
          cols="50"
          required
        />
        {/* 만나는 장소를 선택하는 공간 */}
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

        {/* 수정 완료와 취소 버튼 */}
        <div className="button-container">
          <button type="submit" className="md-submit-button">
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

// 우리가 만든 수정 공간을 다른 곳에서도 쓸 수 있게 내보내요.
export default ModifyPostForm;
