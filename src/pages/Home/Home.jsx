import React from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/jobs');
  };

  return (
    <div className="root">
      <div className="homebox1">
        <div className="top-box1">
          <h2>애완견의 행복한 산책을 위하여!</h2>
          <p>산책인과 반려견 모두 만족하는 WalkiePaw 입니다.</p>
        </div>
        <img src="img/dog1.jpg" className="homebox1-img" alt="homeImg"></img>
      </div>
      <div className="homebox2">
        <img src="img/dog2.jpg" className="homebox2-img" alt="homeImg"></img>
        <div className="text-box1">
          <h2>산책인 모집</h2>
          <p>믿을만한 지역 주민 산책인 모집</p>
          <div className="button1">
            <Link to="/recruit">
              <span>산책인 모집하기</span>
            </Link>{' '}
            {/* 버튼을 눌렀을 때 산책 list로 이동 */}
          </div>
        </div>
      </div>
      <div className="homebox3">
        <img src="img/dog3.jpg" className="homebox3-img" alt="homeImg"></img>
        <div className="text-box2">
          <h2>알바</h2>
          <p>귀여운 강아지와 산책하며 일하기</p>
          <div className="button2">
            <button onClick={handleClick}>
              <span>내 근처 알바 보기</span>
            </button>{' '}
            {/* 버튼을 눌렀을 때 알바 list로 이동 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
