import React, { useState, useEffect } from 'react';
import CardList from '../../components/CardList/CardList';
import './BoardList.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyTown from '../MyTown/MyTown';

const testData = [
  // 한번만 출력되고 더이상 변하지 않는 데이터들은 이렇게 따로 실행되는 함수 밖에 만든다.
  {
    id: 1,
    title: '골댕이 산책 시켜주실 분 구해요.',
    local: '역삼동',
    image: 'img/dog1.jpg',
    memberId: '산책왕',
    status: '구인중',
  },
  {
    id: 2,
    title: '제목2',
    local: '지역2',
    image: 'https://example.com/image2.jpg',
    memberId: '아이디2',
    status: '구인 대기중',
  },
  {
    id: 3,
    title: '제목3',
    local: '지역3',
    image: 'https://example.com/image2.jpg',
    memberId: '아이디3',
    status: '구인 완료',
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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  const navigate = useNavigate();

  const memberNickName = 'kim'; // 로그인 유저의 임시 id 나중에 바꿔야 함

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await testApiData(); // '/api/posts' 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        const response = await axios.get('http://localhost:8080/api/v1/boards'); // '/api/posts' 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        console.log(response);
        const data = response.data ?? [];
        setPosts(data);
        setFilteredPosts(data); // 초기 상태에서는 모든 게시글을 보여줍니다.
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      let newFilteredPosts = posts;

      if (selectedRegion) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post.region === selectedRegion
        );
      }
      if (selectedDistrict) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post.district === selectedDistrict
        );
      }
      if (selectedNeighborhood) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post.neighborhood === selectedNeighborhood
        );
      }

      setFilteredPosts(newFilteredPosts);
    };

    filterPosts();
  }, [selectedRegion, selectedDistrict, selectedNeighborhood, posts]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post, memberNickName } });
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
      <MyTown
        onRegionChange={setSelectedRegion}
        onDistrictChange={setSelectedDistrict}
        onNeighborhoodChange={setSelectedNeighborhood}
      />
      <div
        className={`board-list ${
          filteredPosts?.length === 0 ? 'no-posts-container' : ''
        }`}
      >
        {filteredPosts?.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post)}>
              <CardList
                title={post.title}
                local={post.neighborhood}
                image={post.image}
                memberNickName={`작성자: ${post.memberNickName}`}
                status={post.status} // 구인중, 구인 대기중, 구인 완료 등 상태 정보
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
