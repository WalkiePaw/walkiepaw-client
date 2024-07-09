import { useState, useEffect, useCallback} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw as faSolidPaw } from "@fortawesome/free-solid-svg-icons";
// import debounce from "lodash/debounce";

const MyTransaction = () => {
  const [activeTab, setActiveTab] = useState("walk");
  const MySwal = withReactContent(Swal);

  const [posts, setPosts] = useState([
    { id: 1, title: "산책", member: "상대 회원 닉네임", review: "작성 완료", createdDate: "2024-06-21 10:00" },
    { id: 2, title: "알바", member: "상대 회원 닉네임", review: "리뷰 남기기", createdDate: "2024-06-20 15:30" },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "walk") {
      setPosts([
        { id: 1, title: "산책", member: "상대 회원 닉네임", review: "작성 완료", createdDate: "2024-06-21 10:00" },
      ]);
    } else if (tab === "partTimeJob") {
      setPosts([
        { id: 2, title: "알바", member: "상대 회원 닉네임", review: "리뷰 남기기", createdDate: "2024-06-20 15:30" },
      ]);
    }
  };
  
  // const debouncedSaveReview = useCallback(
  //   debounce((postId, reviewData) => {
  //     saveReview(postId, reviewData);
  //   }, 1000),
  //   []
  // );

  const handleReviewClick = (postId) => {
    const ReviewComponent = () => {
      const [rating, setRating] = useState(0);

      return (
        <div>
          <div className="paw-rating" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {[...Array(5)].map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faSolidPaw}
                onClick={() => setRating(index + 1)}
                style={{ 
                  cursor: "pointer", 
                  fontSize: "2rem", 
                  color: index < rating ? "#FFC107" : "#E0E0E0" 
                }}
              />
            ))}
          </div>
          <textarea id="content" className="swal2-textarea" placeholder="내용"></textarea>
        </div>
      );
    };

    MySwal.fire({
      title: '리뷰 작성',
      html: <ReviewComponent />,
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
      preConfirm: () => {
        const content = document.getElementById('content').value;
        const rating = document.querySelectorAll('.paw-rating .text-[#FFC107]').length;
        if (!rating || !content) {
          Swal.showValidationMessage('모든 필드를 채워주세요');
          return false;
        }
        return { points: rating, content };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // debouncedSaveReview(postId, result.value);
      }
    });
  };

  const saveReview = async (postId, reviewData) => {
    const reviewSaveRequest = {
      point: reviewData.points,
      content: reviewData.content,
      chatroomId: postId,
      revieweeId: 2,
      reviewerId: 1,
    };

    try {
      await axios.post("http://localhost:8080/api/v1/reviews", reviewSaveRequest);
      MySwal.fire({
        title: '리뷰가 저장되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      });
    } catch (error) {
      console.error('Failed to save review', error);
      MySwal.fire({
        title: 'Error',
        text: '리뷰 저장 실패',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} / ${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">내 거래 내역</h1>
      <div className="flex mb-3 dlomb-4">
        <button
          className={`px-8 py-2 rounded-md mr-4 ${
            activeTab === "walk"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("walk")}
        >
          산책
        </button>
        <button
          className={`px-8 py-2 rounded-md ${
            activeTab === "partTimeJob"
              ? "bg-[#43312A] text-white"
              : "bg-[#E8C5A5] text-gray-800"
          }`}
          onClick={() => handleTabClick("partTimeJob")}
        >
          알바
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래한 회원
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리뷰 작성
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일/시간
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.member}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.review === "리뷰 남기기" ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleReviewClick(post.id)}
                    >
                      리뷰 남기기
                    </button>
                  ) : (
                    post.review
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatTime(post.createdDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyTransaction;