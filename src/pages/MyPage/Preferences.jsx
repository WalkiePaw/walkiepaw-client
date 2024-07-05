// 내가 좋아요한 게시글 목록
import React, { useEffect, useState } from "react";
import axios from "axios";

const Preferences = () => {
  const [likes, setLikes] = useState([]);
  const memberId = 1; // 현재 고정된 memberId, 실제 사용할 memberId 로직 필요

  useEffect(() => {
    // 페이지네이션 처리를 위한 변수
    const page = 0; // 임시로 첫 페이지로 설정

    axios
      .get(`http://localhost:8080/api/v1/boards-like/${memberId}?page=${page}`)
      .then((response) => {
        // 백엔드에서 반환된 데이터 구조 확인 후 설정
        setLikes(response.data.content); // content 배열에 있는 데이터로 설정
      })
      .catch((error) => {
        console.error("좋아요한 게시글 목록 받아오기 실패", error);
      });
  }, [memberId]); // memberId가 변경될 때마다 호출되도록 설정

  return (
    <div>
      <h1 className="font-bold text-3xl mb-3">내 관심 목록</h1>
      {likes.length > 0 ? (
        <ul>
          {likes.map((like) => (
            <li key={like.id}>
              <h2>{like.title}</h2>
              <p>{like.content}</p>
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
