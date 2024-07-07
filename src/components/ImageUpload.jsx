import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8080/api/v1/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const uploadedImageUrl = response.data;
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
    setImagePreview(null);
    onImageUpload(null); // 이미지 삭제 시 부모 컴포넌트에 null 전달
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
      <div className="mb-3">
        <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-md overflow-hidden">
          <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              ref={fileInputRef}
              disabled={isUploading}
          />
          {imagePreview ? (
              <>
                <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={handleDeleteImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
          ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                {isUploading ? '업로드 중...' : '클릭하여 사진 업로드'}
              </div>
          )}
        </div>
      </div>
  );
};

export default ImageUpload;