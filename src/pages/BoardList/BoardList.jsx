import React, { useState, useEffect } from 'react';
import CardList from '../../components/CardList/CardList';
import './BoardList.css';
import { Link, useNavigate } from 'react-router-dom';
import MyTown from '../MyTown/MyTown';
import axios from 'axios';

const BoardList = ({ category }) => {
  const [posts, setPosts] = useState(); // 게시글 목록을 저장
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글 목록을 저장
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [selectedDong, setSelectedDong] = useState('');

  const navigate = useNavigate();

  const memberId = 1; // 로그인 유저의 임시 id 나중에 바꿔야 함

  const testData = [
    {
      id: 1,
      title: '골댕이 산책 시켜주실 분 구해요.',
      image: 'img/dog1.jpg',
      memberNickName: 'hong',
      status: 'RECRUITING',
      price: 15000,
      priceType: '시급',
      startTime: new Date('2024-06-21T18:00:00').toISOString(),
      endTime: new Date('2024-06-21T20:00:00').toISOString(),
      category: 'JOB_OPENING',
      dong: '역삼동',
      content: '산책 물품은 준비해드려요~!!',
    },
    {
      id: 2,
      title: '강아지 산책 시켜드려요~22',
      image: 'img/dog1.jpg',
      memberNickName: 'hong',
      status: 'RECRUITING',
      price: 15000,
      priceType: '시급',
      startTime: new Date('2024-06-21T18:00:00').toISOString(),
      endTime: new Date('2024-06-21T20:00:00').toISOString(),
      category: 'JOB_SEARCH',
      dong: '역삼동',
      content: '간식 및 야간 산책에 필요한 형광 조끼는 가지고있습니다!',
    },
    {
      id: 3,
      title: '골댕이 산책 시켜주실 분 구해요.33',
      image: 'img/dog1.jpg',
      memberNickName: 'hong',
      status: 'RECRUITING',
      price: 15000,
      priceType: '일급',
      startTime: new Date('2024-06-21T18:00:00').toISOString(),
      endTime: new Date('2024-06-21T20:00:00').toISOString(),
      category: 'JOB_OPENING',
      dong: '청담동',
      content: '산책 물품은 준비해드려요~!!',
    },
    {
      id: 4,
      title: '강아지 산책 시켜드려요~44',
      image: 'img/dog1.jpg',
      memberNickName: 'hong',
      status: 'RECRUITING',
      price: 15000,
      priceType: '일급',
      startTime: new Date('2024-06-21T18:00:00').toISOString(),
      endTime: new Date('2024-06-21T20:00:00').toISOString(),
      category: 'JOB_SEARCH',
      dong: '청담동',
      content: '간식 및 야간 산책에 필요한 형광 조끼는 가지고있습니다!',
    },
  ];

  function testApiData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(testData);
      }, 1000);
    });
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await testApiData();
        const response = await axios.get('http://localhost:8080/api/v1/boards'); // 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        console.log(response);
        const data = response?.data ?? [];
        // const data = response ?? [];
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      if (!posts) return;

      let newFilteredPosts = posts;

      // 카테고리 필터링
      if (category) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.category === category);
      }

      // 지역 필터링
      if (selectedSi) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.si === selectedSi);
      }
      if (selectedGu) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.gu === selectedGu);
      }
      if (selectedDong) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.dong === selectedDong);
      }

      setFilteredPosts(newFilteredPosts);
    };

    filterPosts();
  }, [category, selectedSi, selectedGu, selectedDong, posts]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post, memberId } });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 카테고리에 따라 다른 페이지 타이틀 출력
  let pageTitle;
  if (category === 'JOB_OPENING') {
    pageTitle = '함께 걷는 행복, 반려견 산책의 모든 것';
  } else if (category === 'JOB_SEARCH') {
    pageTitle = '다양한 반려견 산책 동행을 찾아보세요';
  }

  return (
    <>
      <div className="listTop">
        <h1>
          <p>{pageTitle}</p>
        </h1>
        <img src="img/dog3.jpg" className="listTop-img" alt="반려견 산책" />
      </div>
      <MyTown onSiChange={setSelectedSi} onGuChange={setSelectedGu} onDongChange={setSelectedDong} />
      <div className={`board-list ${filteredPosts?.length === 0 ? 'no-posts-container' : ''}`}>
        {filteredPosts?.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post)}>
              <CardList
                title={post.title}
                local={post.dong}
                price={post.price}
                priceType={post.priceType}
                startTime={post.startTime}
                endTime={post.endTime}
                image={post.image}
                memberNickName={post.memberNickName}
                status={post.status} // 구인중, 구인 대기중, 구인 완료 등 상태 정보
                category={post.category} // 카테고리 정보 전달
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
