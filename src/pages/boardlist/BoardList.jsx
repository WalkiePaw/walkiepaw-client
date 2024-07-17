import React, { useState, useEffect, useCallback, useRef } from "react";

import CardList from "../../components/cardList/CardList";
import "./BoardList.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../store/AuthSlice";

const BoardList = () => {
  const [posts, setPosts] = useState([]); // 게시글 목록을 저장
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글 목록을 저장
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어를 저장
  const [searchOption, setSearchOption] = useState("title"); // 검색 옵션(제목 or 내용) 디폴트 값
  const [category, setCategory] = useState(""); // 게시글 카테고리를 저장
  const [searchResultMessage, setSearchResultMessage] = useState(""); // 검색 결과 메시지
  const [page, setPage] = useState(0); // 기본값 0으로 한다고함
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // 게시글이 출력되기 전 상태 표시
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberId, setMemberId] = useState(null); // 게시글 작성자의 아이디
  const [loginUserId, setLoginUserId] = useState(null); // 로그인한 맴버아이디
  const [userAddresses, setUserAddresses] = useState({
    memberAddress: "",
    selectedAddrs: "",
  });

  // Hooks
  const ref = useRef(null);
  const location = useLocation(); // 현재 경로 정보를 가져오는 Hook
  const navigate = useNavigate(); // 페이지 이동을 위한 함수
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth); // 로그인한 유저의 정보를 가져온다
  const { selectedPlaces } = useSelector((state) => state.selectedPlaces) || [];

  // 유틸리티 함수
  const extractDong = (location) => {
    const match = location?.match(/[가-힣]+동/);
    return match ? match[0] : location;
  };

  // 주요 함수들
  const filterPostsByLocation = useCallback(
    (posts) => {
      if (!isLoggedIn || !Array.isArray(posts) || posts.length === 0)
        return posts;

      const userDong = extractDong(userAddresses.memberAddress);
      const selectedDongs = new Set(
        userAddresses.selectedAddrs
          .split(",")
          .map((addr) => extractDong(addr.trim()))
      );

      return posts.filter((post) => {
        const postDong = extractDong(post.location);
        return userDong === postDong || selectedDongs.has(postDong);
      });
    },
    [isLoggedIn, userAddresses]
  );

  const fetchUserAddresses = useCallback(async () => {
    if (!loginUserId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/members/${loginUserId}/addresses`
      );
      setUserAddresses({
        memberAddress: response.data?.memberAddress || "",
        selectedAddrs: response.data?.selectedAddrs || "",
      });
    } catch (error) {
      console.error("사용자 주소 가져오기 오류!", error);
    }
  }, [loginUserId]);

  const fetchPosts = useCallback(
    async (isCategoryChange = false) => {
      try {
        if (!category || !hasMore) return;
        setLoading(true);
        const params = { page };

        let getList = `http://localhost:8080/api/v1/boards/list/${category}`;
        if (loginUserId) {
          getList += `?memberId=${loginUserId}`;
        }

        const response = await axios.get(getList, { params });
        const data = response?.data?.content ?? [];

        const filteredData = filterPostsByLocation(data);

        if (isCategoryChange) {
          setPosts(filteredData);
          setFilteredPosts(filteredData);
          setPage(0);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...filteredData]);
          setFilteredPosts((prevPosts) => [...prevPosts, ...filteredData]);
          setPage((prevState) => prevState + 1);
        }
        setHasMore(!response.data.last);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    },
    [category, page, hasMore, loginUserId, filterPostsByLocation]
  );

  // 이벤트 핸들러
  const handleOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = async () => {
    // ... (기존 코드 유지)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, {
      state: {
        post,
        memberId,
        detailedLocation: post.detailedLocation,
        priceProposal: post.priceProposal,
        photoUrls: post.photoUrls || [],
        memberPhoto,
      },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // useEffect hooks
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(verifyToken());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user && user.id) {
      setLoginUserId(user.id);
      fetchUserAddresses();
    }
  }, [user, fetchUserAddresses]);

  useEffect(() => {
    const pathName = location?.pathname;
    let newCategory = "";

    if (pathName?.includes("recruit")) {
      newCategory = "JOB_OPENING";
    } else if (pathName?.includes("jobs")) {
      newCategory = "JOB_SEARCH";
    }

    if (newCategory !== category) {
      setCategory(newCategory);
      setPosts([]);
      setFilteredPosts([]);
      setPage(0);
      setHasMore(true);
      setSearchKeyword("");
      setSearchResultMessage("");
    }
  }, [location.pathname, category]);

  useEffect(() => {
    if (category) {
      setPage(0);
    }
  }, [category]);

  useEffect(() => {
    let observer;
    if (ref.current) {
      const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting) {
          await fetchPosts();
        }
      };
      observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
      observer.observe(ref.current);
    }
    return () => observer && observer.disconnect();
  }, [category, page, fetchPosts]);

  // 렌더링 로직
  let pageTitle;
  let imageUrl;
  if (category === "JOB_OPENING") {
    pageTitle = "함께 걷는 행복, 반려견 산책의 모든 것";
    imageUrl = "img/recruit.png";
  } else if (category === "JOB_SEARCH") {
    pageTitle = "다양한 반려견 산책 동행을 찾아보세요";
    imageUrl = "img/jobs.png";
  }
  return (
    <>
      <div className="listTop">
        <span>{pageTitle}</span>
        <img src={imageUrl} className="listTop-img" alt="" />
      </div>
      <div className="filter-container">
        <div className="board-search-container">
          <select
            className="search-filter"
            value={searchOption}
            onChange={handleOptionChange}
          >
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
      <div
        className={`board-list ${
          filteredPosts?.length === 0 && !loading ? "no-posts-container" : ""
        }`}
      >
        {loading && page === 0 ? (
          <div className="loading">Loading...</div>
        ) : filteredPosts?.length > 0 ? (
          <div className="contents">
            {filteredPosts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <CardList
                  boardId={post.id}
                  title={post.title}
                  location={
                    post.location.match(/[가-힣]+동/)?.[0] || post.location
                  }
                  price={post.price}
                  priceType={post.priceType}
                  startTime={post.startTime}
                  endTime={post.endTime}
                  photoUrls={[post.photoUrls]}
                  memberNickName={post.memberNickName}
                  status={post.status} // 구인중, 구인 대기중, 구인 완료 등 상태 정보
                  category={post.category} // 카테고리 정보 전달
                  memberPhoto={post.memberPhoto}
                  loginUserId={loginUserId ?? 0} // 로그인한 사용자의 ID를 전달
                  initialLikeCount={post.likeCount} // 여기서 likeCount 전달
                  initialLiked={post.liked} // 서버에서 받아온 초기 좋아요 상태
                />
              </div>
            ))}
            {/* {loading && <div>Loading...</div>} 페이지가 로딩중인걸 보고싶다면 주석을 풀어라 */}
          </div>
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
        <div
          ref={ref}
          style={{
            height: "10px",
            width: "100%",
          }}
        />
        <div className="bl-button-container">
          {isLoggedIn && (
            <Link to="/new-post">
              <button className="post-button">
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </Link>
          )}
          <button className="top-button" onClick={scrollToTop}>
            <FontAwesomeIcon icon={faCircleArrowUp} />
          </button>
        </div>
      </div>
    </>
  );
};

export default BoardList;
