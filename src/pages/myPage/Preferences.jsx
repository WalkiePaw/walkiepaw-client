import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CardList from '../../components/cardList/CardList';

const Preferences = () => {
  const [likes, setLikes] = useState([]);
  const [posts, setPosts] = useState([]);
  const MySwal = withReactContent(Swal);
  const memberId = 1; // 나중에 바꿀 것

  useEffect(() => {
    const page = 0; //임시 번호

    axios
      .get(`http://localhost:8080/api/v1/boards-like/${memberId}?page=${page}`)
      .then((response) => {
        setLikes(response.data.content);
      })
      .catch((error) => {
        console.error('Failed to fetch liked posts', error);
        MySwal.fire({
          title: 'Error',
          text: '게시글 불러오기 실패',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }, [memberId]);

  const fetchPosts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/boards/mypage/${memberId}/${category}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      MySwal.fire({
        title: 'Error',
        text: '게시글 불러오기 실패',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleLikeClick = (boardId) => {
    // 좋아요버튼,..............
    console.log(`Liked post ${boardId}`);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-6">내 관심 목록</h1>
      {likes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likes.map((like) => (
            <CardList
              key={like.id}
              title={like.title}
              location={like.location}
              image={like.image}
              memberNickName={like.memberNickName}
              status={like.status}
              category={like.category}
              price={like.price}
              priceType={like.priceType}
              startTime={like.startTime}
              endTime={like.endTime}
              onCardClick={() => handleLikeClick(like.id)}
            />
          ))}
        </div>
      ) : (
        <p>관심 목록이 비어 있습니다.</p>
      )}
    </div>
  );
};

export default Preferences;
