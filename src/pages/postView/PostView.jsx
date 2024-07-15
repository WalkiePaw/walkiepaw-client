import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./PostView.css";
import KakaoWithoutSearch from "../../modules/KakaoWithoutSearch";
import pawpaw from "./../../assets/pawpaw.png";
import PostReportModal from "../../components/reportModal/PostReportModal";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel 스타일 가져오기
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { createChatroom } from "../../Api.jsx";
import { toast } from "react-toastify";

const PostView = () => {
  const { postId } = useParams(); // URL에서 postId 파라미터를 가져옴
  const navigate = useNavigate();
  const location = useLocation();
  const [detailedLocation, setDetailedLocation] = useState(
    location.state?.post?.detailedLocation || ""
  );
  const [post, setPost] = useState(location?.state?.post || {}); // 게시글 상태.  초기 상태를 null로 설정
  const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 표시 상태
  const [status, setStatus] = useState(post?.status || "모집중");
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 이미지 슬라이드 인덱스
  const [priceProposal, setPriceProposal] = useState(
    location.state?.priceProposal || false
  ); // 가격 협의 상태
  const [photoUrls, setPhotoUrls] = useState([]); // 사진을 빈배열로 셋팅
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // BoardList에서 로그인한 유저의 id와 nickname을 가져옴

  const [loginUserNickName, setLoginUserNickname] = useState(null);
  const [memberPhoto, setMemberPhoto] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/boards/${postId}`
        );
        const postData = response?.data;
        setPost(postData);
        setStatus(postData?.status);
        setPriceProposal(postData?.priceProposal);
        setDetailedLocation(postData?.detailedLocation);
        setPhotoUrls(postData?.photoUrls);
        setMemberPhoto(postData?.memberPhoto);
      } catch (error) {
        console.error("게시글을 가져오는 중 오류 발생", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const handlerReport = (reason) => {
    console.log("신고 이유: ", reason);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // 게시글 상태 변경 즉시 반영
    try {
      console.log(`게시글 상태 변경 확인!?!: ${newStatus}`);
      await axios.patch(
        `http://localhost:8080/api/v1/boards/status/${postId}`,
        {
          boardId: postId,
          status: newStatus,
        }
      );
      if (user?.nickname !== post.memberNickName) {
        const response = await axios.get(
          `http://localhost:8080/api/v1/boards/${postId}`
        );
        const updatePostData = response?.data || {};
        console.log("상태 변경 됐니?!", response);
        setDetailedLocation(updatePostData?.detailedLocation);
        setPost(updatePostData);
        setStatus(updatePostData?.status);
        setPriceProposal(updatePostData?.priceProposal);
        setPhotoUrls(updatePostData?.photoUrls || []);
      }
    } catch (error) {
      console.error("상태 변경 안됨!", error);
      alert("상태를 변경할 수 없습니다.");
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동하는 로직
    navigate(`/modify-post/${postId}`, {
      state: {
        post: {
          ...post,
          priceType: post.priceType === "HOURLY" ? "시급" : "일급",
          detailedLocation: detailedLocation,
          memberId: user.id,
          priceProposal: post.priceProposal,
          photoUrls: post.photoUrls,
        },
      },
    });
  };

  const handleDelete = async () => {
    // 삭제는 board_id는 남겨두고 '삭제된 게시글 입니다'라고 표시하기.
    // 삭제 확인 및 처리 로직
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/v1/boards/${postId}`
        );
        console.log("삭제 응답", response);
        alert("게시글이 삭제되었습니다.");
        // 카테고리 기반으로 경로 설정
        const categoryPath =
          post.category === "JOB_OPENING" ? "/recruit" : "/jobs";
        navigate(categoryPath);
      } catch (error) {
        console.error("삭제 오류", error);
        alert("게시글을 삭제 할 수 없습니다.");
      }
    }
  };

  const handleCreateChatroom = async () => {
    if (!isLoggedIn || !user) {
      toast.error("채팅을 위해서는 로그인이 필요합니다.");
      navigate("/login", { state: { from: location } });
      return;
    }
    try {
      const chatroom = await createChatroom(postId, user.id); // `postId`와 `user.id`를 인자로 전달
      console.log("새 채팅방 생성 성공:", chatroom);
      // 성공적으로 채팅방이 생성된 후의 로직
      navigate("/chatpage", { state: { selectedChatroomId: chatroom.id } });
    } catch (error) {
      console.error("채팅방 생성 실패:", error.message);
      alert("채팅방을 생성할 수 없습니다.");
    }
  };

  const formatTime = (dataTimeString) => {
    const date = new Date(dataTimeString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`; // 날짜와 시간 모두 포함한 문자열로 변환
  };

  const totalTime = (startTime, endTime) => {
    const start = new Date(startTime); // ISO 문자열에서 직접 Date 타입 객체로 변환
    const end = new Date(endTime);

    const diff = Math.abs(end - start) / 1000; // 초 단위로 차이 계산
    const hours = Math.floor(diff / 3600); // 시간 단위
    const minutes = Math.floor((diff % 3600) / 60); // 분 단위

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}일 ${remainingHours}시간`;
    } else {
      return `${hours}시간 ${minutes}분`;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "RECRUITING":
        return "recruiting";
      case "RESERVED":
        return "reserved";
      case "COMPLETED":
        return "completed";
      default:
        return "";
    }
  };

  // price 단위를 한국단위로
  const formatToKRW = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "decimal",
    }).format(value);
  };

  const getPriceProposalText = (priceProposal) => {
    return priceProposal === true ? "가능" : "불가능";
  };

  return (
    <div className="post-view">
      <div className="post-content">
        {photoUrls.length > 0 && (
          <Carousel
            className="carousel-root"
            showThumbs={false}
            selectedItem={currentSlide}
            onChange={setCurrentSlide}
            infiniteLoop
          >
            {photoUrls.map((photo, index) => (
              <div key={index} className="post-image-container">
                <img
                  src={photo}
                  alt={`Slide ${index + 1}`}
                  className="post-image"
                />
              </div>
            ))}
          </Carousel>
        )}
        {user?.nickname === post.memberNickName && (
          <div className="post-status">
            <select
              value={status}
              onChange={handleStatusChange}
              className={getStatusClass(status)}
            >
              <option
                value="RECRUITING"
                className="post-status-option recruiting"
              >
                모집중
              </option>
              <option value="RESERVED" className="post-status-option reserved">
                예약
              </option>
              <option
                value="COMPLETED"
                className="post-status-option completed"
              >
                구인 완료
              </option>
            </select>
          </div>
        )}
        <div className="post-header">
          <div className="author-info">
            <img
              src={memberPhoto || "/src/assets/default_user.png"}
              alt="Author"
              className="author-image"
            />
            <div className="author-details">
              <span className="author-name">{post.memberNickName}</span>
              <span className="post-location">{post.local}</span>
            </div>
          </div>
          <div className="rating">
            <img src={pawpaw} alt="Rating" className="Rating-photoUrls" /> 5.0{" "}
            {/* 서버에서 평균값을 받아서 출력해야함 */}
          </div>
        </div>
        <div className="post-title">
          <span
            className={`post-status ${status
              .toLowerCase()
              .replace(" ", "-")} ${getStatusClass(status)}`}
          >
            {status === "RECRUITING" && "모집중"}
            {status === "RESERVED" && "예약"}
            {status === "COMPLETED" && "구인 완료"}
          </span>{" "}
          - {post.title}
        </div>
        <div className="post-content-description">
          <div className="post-info-box">
            <div className="post-info-item post-dateTime">
              날짜 및 시간 : {formatTime(post.startTime)} ~{" "}
              {formatTime(post.endTime)}
              <div className="post-totalTime">
                총 시간: {totalTime(post.startTime, post.endTime)}
              </div>
            </div>
            <div className="post-info-item post-priceType">
              {post.priceType === "HOURLY" && "시급"}{" "}
              {post.priceType === "DAILY" && "일급"} : {formatToKRW(post.price)}
              원
              <div className="post-proposal">
                가격 협의 : {getPriceProposalText(post.priceProposal)}
              </div>
            </div>
            <div className="post-info-item post-content-box">
              {post.content}
            </div>
          </div>
        </div>
        <div className="post-location-map">
          <KakaoWithoutSearch defaultAddress={post.location} />
        </div>
        <div className="post-location-box">지역 : {post.location}</div>
        <div className="post-detailedLocation-box">
          상세주소 : {detailedLocation}
        </div>
        {user && (
          <div className="report-box">
            <button
              className="report-button"
              onClick={() => setShowReportModal(true)}
            >
              이 게시글 신고하기
            </button>
          </div>
        )}

        {user?.nickname === post.memberNickName && (
          <div className="post-management">
            <button className="edit-button" onClick={handleEdit}>
              수정하기
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제하기
            </button>
          </div>
        )}
        <div className="button-container">
          <button className="message-button" onClick={handleCreateChatroom}>
            채팅 하기
          </button>
        </div>
      </div>
      {showReportModal && (
        <PostReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handlerReport}
          boardId={postId}
          loginUserId={user.id}
        />
      )}
    </div>
  );
};

export default PostView;
