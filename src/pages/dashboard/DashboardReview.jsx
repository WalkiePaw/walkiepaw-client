import React, { useState, useEffect } from "react";
import pawpaw from "../../assets/pawpaw.png";
import axios from "axios";
import { useLocation } from "react-router-dom";

const DashboardReview = () => {
  // id는 대시보드 회원(글 작성자 또는 채팅 상대방)의 번호
  const [activeTab, setActiveTab] = useState("JOB_OPENING");
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [showNoMoreReviews, setShowNoMoreReviews] = useState(false);

  const location = useLocation();
  console.log("Location state:", location.state); // 로그 추가
  const id = location.state?.id;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setVisibleReviews(3);
    setShowNoMoreReviews(false);
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id, activeTab]);

  const fetchReviews = () => {
    console.log("Fetching reviews with id:", id);

    axios
      .get(`http://57.180.244.228:8000/api/v1/reviews/${id}/reviewee`, {
        params: {
          page: 0,
          category: activeTab,
        },
      })
      .then((response) => {
        const reviewsData = response.data.content;
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
          setShowNoMoreReviews(reviewsData.length <= visibleReviews);
        } else {
          console.error(
            "서버에서 올바른 형식의 리뷰 데이터를 반환하지 않았습니다."
          );
        }
      })
      .catch((error) => {
        console.error("리뷰 목록을 불러오는 중 오류가 발생했습니다:", error);
      });
  };

  useEffect(() => {
    fetchReviews(activeTab);
  }, [activeTab]);

  const handleLoadMore = () => {
    const newVisibleReviews = visibleReviews + 3;
    setVisibleReviews(newVisibleReviews);
    if (newVisibleReviews >= reviews.length) {
      setShowNoMoreReviews(true);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">받은 리뷰 내역</h1>
      <div className="flex mb-3">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === "JOB_OPENING"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_OPENING")}
        >
          산책인 모집글
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === "JOB_SEARCH"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("JOB_SEARCH")}
        >
          알바 구직글
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, visibleReviews).map((review, index) => (
              <div
                key={review.id}
                className={`p-4 bg-white ${
                  index !== 0 ? "border-t border-gray-300" : ""
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="font-medium">평점:</span>
                  {Array(review.point)
                    .fill()
                    .map((_, i) => (
                      <img
                        src={pawpaw}
                        alt="star"
                        key={i}
                        className="inline-block w-8 h-8"
                      />
                    ))}
                </div>
                <div className="mb-2">
                  <span className="font-medium">거래한 회원:</span>{" "}
                  {review.memberName}
                </div>
                <div className="mb-2">
                  <span className="font-medium">내용:</span> {review.content}
                </div>
              </div>
            ))}
            {!showNoMoreReviews && (
              <div className="flex justify-end mt-4 p-4 border-t border-gray-300">
                <button
                  className="px-4 py-2 bg-[#E8C5A5] text-gray-800 rounded-md"
                  onClick={handleLoadMore}
                >
                  더보기
                </button>
              </div>
            )}
            {showNoMoreReviews && (
              <p className="mt-2 text-lg font-medium text-gray-500 p-4 border-t border-gray-300">
                더 이상 받은 리뷰가 없습니다.
              </p>
            )}
          </>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            받은 리뷰 내역이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardReview;
