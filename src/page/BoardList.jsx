import React, { useState } from 'react';
import CardList from '../components/CardList';
import './BoardList.css';

const BoardList = () => {
	// 예시로 초기 데이터 배열을 useState를 통해 관리
	const [cardDataList, setCardDataList] = useState([
		{
			id: 1,
			title: '제목1',
			local: '지역1',
			image: 'https://example.com/image1.jpg',
			memberId: '아이디1',
		},
		{
			id: 2,
			title: '제목2',
			local: '지역2',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디2',
		},
		{
			id: 3,
			title: '제목2',
			local: '지역2',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디2',
		},
		{
			id: 4,
			title: '제목2',
			local: '지역2',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디2',
		},
		// 추가적인 카드 데이터를 필요한 만큼 추가할 수 있음
	]);
	return (
		<>
			<div className='listTop'>
				<h1>
					<p>함께 걷는 행복, 반려견 산책의 모든 것</p>
				</h1>
				<img
					src='dog3.jpg'
					className='listTop-img'
				></img>
			</div>
			<div className='board-list'>
				{cardDataList.map((cardData) => (
					<CardList
						key={cardData.id} // 고유한 키 값으로 반복 요소 식별
						title={cardData.title}
						local={cardData.local}
						image={cardData.image}
						memberId={cardData.memberId}
					/>
				))}
			</div>
			<div className='button-container'>
				<button className='post-button'>글 작성</button>
				<button className='top-button'>Top</button>
			</div>
		</>
	);
};

export default BoardList;
