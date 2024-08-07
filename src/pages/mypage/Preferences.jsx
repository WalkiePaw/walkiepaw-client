import React, { useEffect, useState, useCallback } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CardList from "../../components/cardList/CardList";

const Preferences = () => {
  const { id } = useOutletContext(); // id를 context에서 가져옵니다.
  const [likes, setLikes] = useState([]);
  const [likeChanges, setLikeChanges] = useState({});
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchLikes();
    }
  }, [id]);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(
          `http://57.180.244.228:8000/api/v1/boards-like/${id}?page=0`
      );
      setLikes(response.data.content);
      console.log('서버 응답: ', response.data);
    } catch (error) {
      console.error("Failed to fetch liked posts", error);
      MySwal.fire({
        title: "Error",
        text: "게시글 불러오기 실패",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLikeChange = useCallback((boardId, isLiked) => {
    boardId = Number(boardId);
    setLikeChanges((prev) => ({ ...prev, [boardId]: isLiked }));
    setLikes((prevLikes) =>
        prevLikes.map((like) =>
            like.id === boardId
                ? {
                  ...like,
                  likeCount: isLiked ? like.likeCount + 1 : like.likeCount - 1,
                }
                : like
        )
    );
  }, []);

  // 동만 추출해서 가져오는 함수
  const dongFromLocal = (location) => {
    const match = location?.match(/[가-힣]+동/);
    return match ? match[0] : location;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(likeChanges).length > 0) {
        updateLikesToServer();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [likeChanges]);

  const updateLikesToServer = async () => {
    const updatePromises = Object.entries(likeChanges).map(
        ([boardId, isLiked]) => {
          boardId = Number(boardId);
          if (isLiked) {
            return axios.post(`http://57.180.244.228:8000/api/v1/boards-like`, {
              loginUserId: id,
              boardId,
            });
          } else {
            return axios.delete(`http://57.180.244.228:8000/api/v1/boards-like`, {
              data: { loginUserId: id, boardId },
            });
          }
        }
    );

    try {
      await Promise.all(updatePromises);
      setLikeChanges({});
    } catch (error) {
      console.error("Failed to update likes", error);

      // 에러 발생 시, 좋아요 상태를 원래대로 되돌립니다.
      setLikes((prevLikes) =>
          prevLikes.map((like) => ({
            ...like,
            likeCount: like.likeCount - (likeChanges[like.id] ? 1 : -1),
          }))
      );
    }
  };

  const handleCardClick = (boardId) => {
    navigate(`/post/${boardId}`);  // PostView 페이지로 이동
  };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-6">내 관심 목록</h1>
      <div className="w-full overflow-hidden rounded-lg border border-gray-300">
      {likes.length > 0 ? (
        <div className="ml-3 mr-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likes.map((like, index) => (
            <div onClick={() => handleCardClick(like.id)} key={`${like.id}-${index}`}>
              <CardList
                boardId={like.id}
                title={like.title}
                location={dongFromLocal(like.location)}
                memberPhoto={like.memberPhoto}
                photoUrls={like.photoUrls}
                memberNickName={like.memberNickName}
                status={like.status}
                category={like.category}
                price={like.price}
                priceType={like.priceType}
                startTime={like.startTime}
                endTime={like.endTime}
                initialLiked={true}
                likeCount={like.likeCount}
                loginUserId={id}
                initialLikeCount={like.likeCount}
                onLikeChange={handleLikeChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-4 text-center text-gray-500">
        내 관심 목록이 없습니다
        </div>      
      )}
      </div>
    </div>
  );
};
export default Preferences;