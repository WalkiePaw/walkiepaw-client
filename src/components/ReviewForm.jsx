// 리뷰 작성 폼
import React, { useState } from 'react';
// styled-components
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw as faSolidPaw } from "@fortawesome/free-solid-svg-icons";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PawRating = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 1rem;
`;

const PawIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 1.5rem;
  color: ${props => props.active ? '#FFC107' : '#D1D5DB'};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #2563EB;
  }
`;

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || content.trim() === '') {
      alert('별점과 내용을 모두 입력해주세요.');
      return;
    }
    onSubmit({ points: rating, content });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <PawRating>
        {[...Array(5)].map((_, index) => (
          <PawIcon
            key={index}
            icon={faSolidPaw}
            onClick={() => setRating(index + 1)}
            active={index < rating}
          />
        ))}
      </PawRating>
      <TextArea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰 내용을 입력해주세요"
        rows="4"
      />
      <SubmitButton type="submit">
        리뷰 저장
      </SubmitButton>
    </FormContainer>
  );
};

export default ReviewForm;