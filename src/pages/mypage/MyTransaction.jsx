// 거래 내역 + 리뷰 달기
import { useState, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import ReviewForm from "../../components/ReviewForm";
import formatTime from "../../util/formatTime";

const MyTransaction = () => {
  const { id } = useOutletContext(); // id를 context에서 가져옵니다.
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const MySwal = withReactContent(Swal);

  const fetchTransactions = async (page = 0) => {
    if (!id) return;
    try {
      const response = await axios.get(
          `http://localhost:8080/api/v1/chatrooms/${id}/transaction`,
          {
            params: {
              page: page,
              size: 10,
              sort: "createdDate,desc",
            },
          }
      );
      if (page === 0) {
        setTransactions(response.data.content);
      } else {
        setTransactions((prev) => [...prev, ...response.data.content]);
      }
      setHasMore(!response.data.last);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      MySwal.fire({
        title: "Error",
        text: "거래 내역을 불러오는데 실패했습니다",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransactions();
    }
  }, [id]);


  const handleReviewClick = (transaction) => {
    MySwal.fire({
      title: "리뷰 작성",
      html: (
        <ReviewForm
          onSubmit={(reviewData) => {
            MySwal.close();
            saveReview(transaction, reviewData);
          }}
        />
      ),
      showConfirmButton: false,
      showCloseButton: true,
      width: "500px",
    });
  };

  const saveReview = async (transaction, reviewData) => {
    const reviewSaveRequest = {
      point: reviewData.points,
      content: reviewData.content,
      chatroomId: transaction.chatroomId,
      reviewerId: id, // 현재 로그인한 사용자의 ID
      category: transaction.category,
    };

    console.log("Review request data:", reviewSaveRequest); // 요청 데이터 로깅

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/reviews",
        reviewSaveRequest
      );

      MySwal.fire({
        title: "리뷰가 저장되었습니다",
        icon: "success",
        confirmButtonText: "확인",
      });
      fetchTransactions();
    } catch (error) {
      console.error("Failed to save review:", error);
      MySwal.fire({
        title: "Error",
        text: "리뷰 저장에 실패했습니다",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const loadMore = () => {
    if (hasMore) {
      fetchTransactions(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-5 mr-4">내 거래 내역</h1>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                게시글 제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래한 회원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리뷰 작성
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래일/시간
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.chatroomId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.memberNickName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!transaction.hasReview ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleReviewClick(transaction)}
                    >
                      리뷰 남기기
                    </button>
                  ) : (
                    "작성 완료"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatTime(transaction.createdDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={loadMore}
        >
          더 보기
        </button>
      )}
    </div>
  );
};

export default MyTransaction;
