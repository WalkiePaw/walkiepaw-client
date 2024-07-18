import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ModifyPostForm.css";
import KakaoMap from "../../../modules/Kakao";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faChevronLeft,
  faChevronRight,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ModifyPostForm = () => {
  const location = useLocation(); // 현재 위치 정보를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 함수입니다.
  const initialPost = location?.state?.post; // 수정할 게시글의 초기 데이터를 가져옵니다.
  const [photos, setPhotos] = useState(initialPost?.photos || []); // 게시글의 이미지를 상태로 관리합니다.
  const [photoUrls, setPhotoUrls] = useState(initialPost?.photoUrls || []);
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스를 상태로 관리합니다.
  const [category, setCategory] = useState(
    initialPost?.category === "JOB_OPENING" ? "산책" : "알바"
  ); // 게시글의 카테고리 값을 가져온다.
  const [priceProposal, setPriceProposal] = useState(
    initialPost?.priceProposal || false
  );

  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [post, setPost] = useState({
    ...initialPost,
    startDate: formatDateTimeLocal(initialPost?.startTime),
    endDate: formatDateTimeLocal(initialPost?.endTime),
    priceType: initialPost?.priceType === "HOURLY" ? "시급" : "일급",
    priceProposal: initialPost?.priceProposal || false,
  }); // 게시글 정보 상태를 관리

  // 게시글 정보가 변경 업데이트
  useEffect(() => {
    setPost({
      ...initialPost,
      startDate: formatDateTimeLocal(initialPost?.startTime),
      endDate: formatDateTimeLocal(initialPost?.endTime),
      priceType: initialPost?.priceType === "HOURLY" ? "시급" : "일급",
      priceProposal: initialPost?.priceProposal || false,
    });
    setPhotoUrls(initialPost?.photoUrls || []);
    setCategory(initialPost?.category === "JOB_OPENING" ? "산책" : "알바");
    setPriceProposal(initialPost?.priceProposal || false);
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
      uploadImages(files).then((urls) => {
        setPhotos([...photos, ...results]); // 이미지 미리보기를 위한 상태 업데이트
        setPhotoUrls((prevUrls) => [
          ...prevUrls,
          ...urls.map((url) => url.url),
        ]); // 실제 이미지 URL을 상태 업데이트
      }); // 첨부한 이미지를 서버에 업로드
    });
  };

  const handleRemovePhoto = (slideIndex) => {
    console.log(slideIndex);
    const actualIndex = currentSlide * 4 + slideIndex;

    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== actualIndex));
    setPhotoUrls((prevUrls) => prevUrls.filter((_, i) => i !== actualIndex));

    // 마지막 사진을 지웠을 때 현재 슬라이드 조정
    if (actualIndex % 4 === 0 && actualIndex === photoUrls.length - 1) {
      setCurrentSlide((prev) => Math.max(0, prev - 1));
    }
  };

  const uploadImages = async (files) => {
    const urls = await Promise.all(files.map((file) => uploadImage(file)));
    return urls; // 이미지 업로드 후 받은 URL 배열 반환
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

  // 폼 제출 처리 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 페이지가 새로고침되는 걸 막아요.

    console.log("수정 전 photoUrls:", photoUrls);

    // 수정된 게시글 정보를 생성
    const modifiedPost = {
      ...post, // 기존 게시글의 모든 속성을 복사합니다.
      photoUrls: photoUrls,
      priceType: post.priceType === "시급" ? "HOURLY" : "DAILY",
      price: parseInt(post.price),
      priceProposal: priceProposal,
      startTime: formatDateTimeLocal(post.startDate),
      endTime: formatDateTimeLocal(post.endDate),
      category: category === "산책" ? "JOB_OPENING" : "JOB_SEARCH",
      location: post.location,
      detailedLocation: post.detailedLocation,
    };

    try {
      const response = await axios.patch(
          `http://localhost:8080/api/v1/boards/${post.id}`,
          modifiedPost,
          {
            headers: {
              "Content-Type": "application/json",
            },
        }
      );

      if (response?.status === 200 || response?.status === 204) {
        toast.success("게시글이 수정되었습니다.");
        const categoryPath = category === "산책" ? "/recruit" : "/jobs";
        navigate(categoryPath);
      } else {
        throw new Error("게시글 수정 실패!");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("게시글 수정에 실패했습니다.");
    }
  };

  // 지도에서 선택한 장소를 처리하는 함수
  const handlePlaceSelect = (address) => {
    setPost({
      ...post, // 기존 게시글의 모든 속성을 복사합니다.
      location: address,
    });
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  const handlePriceProposalToggle = () => {
    setPriceProposal(!priceProposal);
  };

  return (
    <div className="modify-post-container">
      {/* 이미지 업로드 영역 */}
      <div className="image-upload">
        {/* 사진 올리기 버튼 */}
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
        {photoUrls.length === 0 && (
          <p className="image-required-text">
            첨부한 이미지의 첫 번째가 메인 사진입니다.
          </p>
        )}
        {photoUrls.length > 0 && (
          <div className="image-slider">
            <button className="prev-button" onClick={handlePrevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="image-preview-container">
              {photoUrls
                .slice(currentSlide * 4, currentSlide * 4 + 4)
                .map((photoUrls, index) => (
                  <div key={index} className="image-preview-wrapper">
                    <img
                      key={index}
                      src={[photoUrls]}
                      alt={`Uploaded Preview ${index}`}
                      className="image-preview"
                      style={{ aspectRatio: "1 / 1" }} // 이미지 비율을 1:1로 설정
                    />
                    <button onClick={() => handleRemovePhoto(index)}>
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
            className={`btn-price-hour ${
              post.priceType === "시급" ? "selected" : ""
            }`}
            onClick={() => setPost({ ...post, priceType: "시급" })}
          >
            시급
          </button>
          <button
            type="button"
            className={`btn-price-day ${
              post.priceType === "일급" ? "selected" : ""
            }`}
            onClick={() => setPost({ ...post, priceType: "일급" })}
          >
            일급
          </button>
          <div className="price-proposal">
            <div className="switch-container">
              <label htmlFor="priceProposal">가격 협의:</label>
              <label className="switch">
                <input
                  type="checkbox"
                  id="priceProposal"
                  checked={priceProposal} // priceProposal 상태를 checked 속성에 바인딩
                  onChange={handlePriceProposalToggle}
                />
                <span className="price-slider round"></span>
              </label>
            </div>
          </div>
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
            <span style={{ margin: "0 40px" }}> ~ </span>
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
            onClick={() => navigate(-1)} // 현재 페이지에서 이전 페이지로 이동합니다.
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
