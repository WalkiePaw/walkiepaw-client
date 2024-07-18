import React, { useState, useEffect } from "react";
import KakaoMap from "../../../modules/Kakao";
import "./NewPostForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faChevronLeft,
  faChevronRight,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const NewPostForm = () => {
  const [title, setTitle] = useState("");
  const [priceType, setPriceType] = useState("시급");
  const [price, setPrice] = useState("");
  const [priceProposal, setPriceProposal] = useState(false); //  초기 값을 flase로 설정
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState(""); // 지도의 위치와 주소
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]); // 이미지를 저장한 URL을 저장
  const [detailedLocation, setDetailedLocation] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [category, setCategory] = useState("JOB_OPENING");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
      setPhotos([...photos, ...results]);
      uploadImages(files); // 첨부한 이미지를 서버에 업로드
    });
  };

  const uploadImages = async (files) => {
    const urls = await Promise.all(files.map((file) => uploadImage(file)));
    setPhotoUrls([...photoUrls, ...urls]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/uploads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.error("이미지 업로드 에러!", error);
    }
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === photoUrls.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? photoUrls.length - 1 : prevSlide - 1
    );
  }; // 이미지 무한 루프

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);

    const updateUrls = [...photoUrls];
    updateUrls.splice(index, 1);
    setPhotoUrls(updateUrls);
  };

  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPost = {
      title,
      priceType: priceType === "시급" ? "HOURLY" : "DAILY",
      price: parseInt(price), // 금액을 정수로 변환
      startTime: formatDateTimeLocal(startTime),
      endTime: formatDateTimeLocal(endTime),
      content,
      location,
      detailedLocation,
      photoUrls,
      memberId: user.id,
      category: category === "산책" ? "JOB_OPENING" : "JOB_SEARCH",
      priceProposal,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/boards",
        newPost,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("서버 응답:", response);

      if (response?.status === 201) {
        alert("게시글 저장 완료!");
        // 카테고리 기반 경로 설정
        const categoryPath = category === "산책" ? "/recruit" : "/jobs";
        navigate(categoryPath);
      } else {
        throw new Error("게시글 저장 실패!");
      }
    } catch (error) {
      console.error("Error", error);
      alert("게시글 저장에 실패했습니다.");
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

  const handlePriceProposalToggle = () => {
    setPriceProposal(!priceProposal); // 현재 값의 반대로 토글
  };

  return (
    <div className="new-post-container">
      <div className="image-upload">
        <label htmlFor="image-upload" className="image-upload-button">
          <FontAwesomeIcon icon={faCamera} style={{ height: "100%" }} />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        {photos.length === 0 && (
          <p className="image-required-text">
            첨부한 이미지의 첫 번째가 메인 사진입니다.
          </p>
        )}
        {photos.length > 0 && (
          <div className="image-slider">
            <button className="prev-button" onClick={handlePrevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="image-preview-container">
              {photos
                .slice(currentSlide * 4, currentSlide * 4 + 4)
                .map((image, index) => (
                  <div key={index} className="image-preview-wrapper">
                    <img
                      key={index}
                      src={image}
                      alt={`Uploaded Preview ${index}`}
                      className="image-preview"
                      style={{ aspectRatio: "1 / 1" }} // 이미지 비율을 1:1로 설정
                    />
                    <button
                      onClick={() =>
                        handleRemovePhoto(currentSlide * 4 + index)
                      }
                    >
                      <FontAwesomeIcon
                        className="remove-image-button"
                        icon={faTimesCircle}
                      />
                    </button>
                  </div>
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
          className={`btn-category ${category === "산책" ? "selected" : ""}`}
          onClick={() => handleCategoryClick("산책")}
        >
          산책
        </button>
        <button
          type="button"
          className={`btn-category ${category === "알바" ? "selected" : ""}`}
          onClick={() => handleCategoryClick("알바")}
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
            className={`btn-price-hour ${
              priceType === "시급" ? "selected" : ""
            }`}
            onClick={() => handlePriceTypeClick("시급")}
          >
            <span>시급</span>
          </button>
          <button
            type="button"
            className={`btn-price-day ${
              priceType === "일급" ? "selected" : ""
            }`}
            onClick={() => handlePriceTypeClick("일급")}
          >
            <span>일급</span>
          </button>
          <div className="price-proposal">
            <div className="switch-container">
              <label htmlFor="priceProposal">가격 협의:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  id="priceProposal"
                  checked={priceProposal}
                  onChange={handlePriceProposalToggle}
                />
                <span className="price-slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <label htmlFor="price">금액:</label>
        <input
          type="text"
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
          <span style={{ margin: "0 40px" }}>~</span>
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
