import React from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate('/board-list1');
	};

	return (
		<div className='root'>
			<h1 className='box1'>
				<p>애완견의 행복한 산책을 위하여!</p>
				<img
					src='dog1.jpg'
					className='box1-img'
				></img>
			</h1>
			<h1 className='box2'>
				<img
					src='dog2.jpg'
					className='box2-img'
				></img>
				<p>믿을만한 지역 주민 산책인 모집</p>
				<Link to='/board-list'>산책인 모집하기</Link> {/* 버튼을 눌렀을 때 산책 list로 이동 */}
			</h1>
			<h1 className='box3'>
				<img
					src='dog3.jpg'
					className='box3-img'
				></img>
				<p>귀여운 강아지와 산책하며 일하기</p>
				<button onClick={handleClick}>내 근처 알바 보기</button> {/* 버튼을 눌렀을 때 알바 list로 이동 */}
			</h1>
			<h1 className='box4'></h1>
		</div>
	);
};

export default Home;
