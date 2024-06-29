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
        <h2>
          <p>애완견의 행복한 산책을 위하여!</p>
        </h2>
        <img src="img/dog1.jpg" className="homebox1-img" alt="homeImg"></img>
      </div>
      <div className="homebox2">
        <img src="img/dog2.jpg" className="homebox2-img" alt="homeImg"></img>

        <h2>
          <p>믿을만한 지역 주민 산책인 모집</p>
        </h2>
        <div className="button1">
          <Link to="/recruit">산책인 모집하기</Link>{' '}
          {/* 버튼을 눌렀을 때 산책 list로 이동 */}
        </div>
      </div>
      <div className="homebox3">
        <img src="img/dog3.jpg" className="homebox3-img" alt="homeImg"></img>
        <h2>
          <p>귀여운 강아지와 산책하며 일하기</p>
        </h2>
        <div className="button2">
          <button onClick={handleClick}>내 근처 알바 보기</button>{' '}
          {/* 버튼을 눌렀을 때 알바 list로 이동 */}
        </div>
      </div>
      <div className="homebox4"></div>
    </div>
  );
};

export default Home;
