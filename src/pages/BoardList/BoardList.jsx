import React, { useState, useEffect } from 'react';
import CardList from '../../components/cardList/CardList';
import './BoardList.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MyTown from '../myTown/MyTown';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';

const BoardList = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록을 저장
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글 목록을 저장
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [selectedDong, setSelectedDong] = useState('');
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어를 저장
  const [searchOption, setSearchOption] = useState('title'); // 검색 옵션(제목 or 내용) 디폴트 값
  const [category, setCategory] = useState(''); // 게시글 카테고리를 저장
  const [searchResultMessage, setSearchResultMessage] = useState(''); // 검색 결과 메시지
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation(); // 현재 경로 정보를 가져오는 Hook
  const navigate = useNavigate(); // 페이지 이동을 위한 함수

  const memberNickName = '헬스유투버'; // 로그인 유저의 임시 id 나중에 바꿔야 함
  const memberId = 1;

  // location의 값에서 '동'이 포함된 값만 추출
  const dongFromLocal = (location) => {
    const match = location?.match(/[가-힣]+동/);
    return match ? match[0] : location;
  };

  // 페이지 경로에 따라 카테고리를 설정
  useEffect(() => {
    const pathName = location.pathname;
    if (pathName.includes('recruit')) {
      setCategory('JOB_OPENING');
    } else if (pathName.includes('jobs')) {
      setCategory('JOB_SEARCH');
    }
    // 페이지의 카테고리가 변경 될 때 마다 검색 키워드 초기화
    setSearchKeyword('');
    setFilteredPosts('');
    setSearchResultMessage('');
  }, [location.pathname]);

  // 카테고리가 변경되면 해당 게시글의 정보를 가져와 게시글의 정보를 다시 저장
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!category || !hasMore) return; // 카테고리가 없으면 요청하지 않도록 처리

        const response = await axios.get(`http://localhost:8080/api/v1/boards/list/${category}`, {
          params: { page, size: 4 },
        }); // 엔드포인트는 백엔드 서버의 게시글 목록을 반환해야 합니다.
        console.log(response);
        const data = response?.data?.content ?? [];
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setHasMore(response.data?.last === false);
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, [category, page, hasMore]);

  // 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  // 카테고리, 지역, 검색어 필터링
  useEffect(() => {
    const filterPosts = () => {
      if (!posts) return; // 게시글이 없으면 필터링을 하지 않음

      let newFilteredPosts = posts;

      // 지역 필터링
      if (selectedSi) {
        // location이 Null일 때, includes()를 호출한다.
        newFilteredPosts = newFilteredPosts.filter((post) => post.location?.includes(selectedSi));
      }
      if (selectedGu) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.location?.includes(selectedGu));
      }
      if (selectedDong) {
        newFilteredPosts = newFilteredPosts.filter((post) => post.location?.includes(selectedDong));
      }

      setFilteredPosts(newFilteredPosts);
    };

    filterPosts();
  }, [selectedSi, selectedGu, selectedDong, posts, searchKeyword]);

  // 검색 옵션 변경 핸들러
  const handleOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = async () => {
    try {
      const params = {
        category,
        page: 0,
        size: 12,
      };

      if (searchOption === 'title') {
        params.title = searchKeyword;
      } else if (searchOption === 'content') {
        params.content = searchKeyword;
      }

      const response = await axios.get(`http://localhost:8080/api/v1/boards/search`, { params });
      console.log(response.data);

      // 검색 결과가 없는 경우 처리
      if (response.data?.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
      }

      setPosts(response.data?.content);
      setFilteredPosts(response?.data?.content);
      setHasMore(response.data?.last === false);
      setPage(1);
    } catch (error) {
      console.error('검색 요청 실패!', error);
      alert('검색에 실패 했습니다.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // 게시글을 클릭하면 해당 게시글의 정보과 로그인한 맴버의 정보를 전달하면서 이동
  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, {
      state: {
        post,
        memberNickName,
        memberId,
        detailedLocation: post.detailedLocation,
        priceProposal: post.priceProposal,
      },
    });
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
        <h1>{pageTitle}</h1>
        <img src="img/dog3.jpg" className="listTop-img" alt="반려견 산책" />
      </div>
      <div className="filter-container">
        <MyTown onSiChange={setSelectedSi} onGuChange={setSelectedGu} onDongChange={setSelectedDong} />
        <div className="board-search-container">
          <select className="search-filter" value={searchOption} onChange={handleOptionChange}>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={`board-list ${filteredPosts?.length === 0 ? 'no-posts-container' : ''}`}>
        {filteredPosts?.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post)}>
              <CardList
                title={post.title}
                location={dongFromLocal(post.location)}
                price={post.price}
                priceType={post.priceType}
                startTime={post.startTime}
                endTime={post.endTime}
                image={post.image}
                memberNickName={post.memberNickName}
                status={post.status} // 구인중, 구인 대기중, 구인 완료 등 상태 정보
                category={post.category} // 카테고리 정보 전달
              />
            </div>
          ))
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
        <div className="bl-button-container">
          <Link to="/new-post">
            <button className="post-button">
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </Link>
          <button className="top-button" onClick={scrollToTop}>
            <FontAwesomeIcon icon={faCircleArrowUp} />
          </button>
        </div>
      </div>
    </>
  );
};

export default BoardList;
