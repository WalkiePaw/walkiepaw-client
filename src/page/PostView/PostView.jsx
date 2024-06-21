// src/components/PostView/PostView.jsx
import React from 'react';
import './PostView.css';

const PostView = ({ post, onClose }) => {
  return (
    <div className="post-view">
      <div className="post-content">
        <img src={post.image} alt={post.title} />
        <p>작성자: {post.memberId}</p>
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
        <h2>{post.title}</h2>

        <p>지역: {post.local}</p>

        <p>내용: {post.content}</p>
      </div>
    </div>
  );
};

export default PostView;
