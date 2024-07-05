// 내가 좋아요한 게시글 목록
import React, { useEffect, useState } from "react";
import axios from "axios";

const Preferences = () => {
  const [likes, setLikes] = useState([]);
  const memberId = 1;

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/boards-like/${memberId}?page=0`)
      .then((response) => {
        setLikes(response.data);
      })
      .catch((error) => {
        console.error("좋아요한 게시글 목록 받아오기 실패", error);
      });
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl mb-3">내 관심 목록</h1>
      {likes.length > 0 ? (
        <ul>
          {likes.map((like) => (
            <li key={like.id}>
              <h2>{like.board.title}</h2>
              <p>{like.board.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>관심 목록이 비어 있습니다.</p>
      )}
    </div>
  );
};

export default Preferences;
