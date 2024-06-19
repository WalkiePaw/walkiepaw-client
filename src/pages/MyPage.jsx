import { useParams } from "react-router-dom";
import React from "react";
import { Link } from 'react-router-dom';
import './MyPage.css';
import { getProfileImage } from './../util/profile-img';

const MyPage = () => {
  return (
    <div className="mypage-container">
      <aside className="sidebar">
        <div className="profile">
          <img src={getProfileImage(1)} alt="Profile" className="profile-image" />
          <div className="username">홍길동</div>
        </div>
        <nav className="sidebar-nav">
          <h3>내 활동</h3>
          <ul>
            <li><Link to="#">동네 인증하기</Link></li>
            <li><Link to="#">모아보기</Link></li>
          </ul>
          <h3>내 정보</h3>
          <ul>
            <li><Link to="#">회원 정보 수정</Link></li>
          </ul>
          <h3>고객센터</h3>
          <ul>
            <li><Link to="#">1:1 문의</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>내 정보 수정</h1>
        <form>
          <div>
            <label>이름</label>
            <input type="text" name="firstName" />
          </div>
          <div>
            <label>성</label>
            <input type="text" name="lastName" />
          </div>
          <div>
            <label>아이디</label>
            <input type="text" name="username" />
          </div>
          <div>
            <label>이메일 주소</label>
            <input type="email" name="email" />
          </div>
          <div>
            <label>전화번호</label>
            <input type="tel" name="phone" />
          </div>
          <div>
            <label>생년월일</label>
            <input type="date" name="birthdate" />
          </div>
          <div>
            <label>사진</label>
            <input type="file" name="profileImage" />
          </div>
          <button type="submit">저장</button>
        </form>
      </main>
    </div>
  );
}

export default MyPage;
