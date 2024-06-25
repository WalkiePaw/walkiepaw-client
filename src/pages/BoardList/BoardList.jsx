import React, { useState, useEffect } from 'react';
import CardList from '../../components/CardList/CardList';
import './BoardList.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyTown from '../MyTown/MyTown';

const testData = [
  {
    id: 1,
    title: '골댕이 산책 시켜주실 분 구해요.',
    local: '역삼동',
    image: 'img/dog1.jpg',
    memberId: '산책왕',
  },
  {
    id: 2,
    title: '제목2',
    local: '지역2',
    image: 'https://example.com/image2.jpg',
    memberId: '아이디2',
  },
  {
    id: 3,
    title: '제목3',
    local: '지역3',
    image: 'https://example.com/image2.jpg',
    memberId: '아이디3',
  },
];

function testApiData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(testData);
    }, 1000);
  });
}

const BoardList = () => {
  const [posts, setPosts] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await testApiData(); // '/api/posts' 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        // const response = await axios.get('/api/posts'); // '/api/posts' 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        console.log(response);
        setPosts(response ?? []);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="listTop">
        <h1>
          <p>함께 걷는 행복, 반려견 산책의 모든 것</p>
        </h1>
        <img src="img/dog3.jpg" className="listTop-img" alt="반려견 산책" />
      </div>
      <MyTown />
      <div className="board-list">
        {posts?.length > 0 ? (
          posts.reverse().map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post)}>
              <CardList
                title={post.title}
                local={post.local}
                image={post.image}
                memberId={post.memberId}
                onCardClick={() => handlePostClick(post)}
              />
            </div>
          ))
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
        <div className="bl-button-container">
          <Link to="/new-post">
            <button className="post-button">글 작성</button>
          </Link>
          <button className="top-button" onClick={scrollToTop}>
            Top^
          </button>
        </div>
      </div>
    </>
  );
};

export default BoardList;
