// 이미지 업로드
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// 삭제 시 x 아이콘
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const ImageUpload = ({ onImageUpload, initialImage, readOnly }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage);
    }
  }, [initialImage]);

  const handleImageChange = async (e) => {
    if (readOnly) return;

    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8080/api/v1/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const uploadedImageUrl = response.data.url;
        setImagePreview(uploadedImageUrl);
        onImageUpload(uploadedImageUrl); // 부모 컴포넌트에 URL 전달

      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        // 에러 처리 (예: 사용자에게 알림)
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteImage = () => {
    if (readOnly) return;

    setImagePreview(null);
    onImageUpload(null); // 이미지 삭제 시 부모 컴포넌트에 null 전달
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-3">
      <div className={`relative ${readOnly ? 'w-24 h-24 mx-auto' : 'w-48 h-48'} ${readOnly ? '' : 'border-2 border-dashed border-gray-300'} rounded-md overflow-hidden`}>
        {!readOnly && (
          <input
            type="file"
            name="profileImage"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            ref={fileInputRef}
            disabled={isUploading}
          />
        )}
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!readOnly && (
              <button
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 text-red-500 rounded-full p-1 hover:text-red-600 focus:outline-none"
                type="button"
                style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faCircleXmark} size='lg' />

              </button>
            )}
          </>
        ) : (
          !readOnly && (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              {isUploading ? '업로드 중...' : '클릭하여 사진 업로드'}
            </div>
          )
        )}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func,
  initialImage: PropTypes.string,
  readOnly: PropTypes.bool,
};

ImageUpload.defaultProps = {
  onImageUpload: () => {},
  initialImage: null,
  readOnly: false,
};

export default ImageUpload;
