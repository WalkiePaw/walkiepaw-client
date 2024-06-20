import React, { useState } from 'react';
import CardList from '../../components/CardList';
import './BoardList.css';
import { Link } from 'react-router-dom';

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
			title: '제목3',
			local: '지역3',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디3',
		},
		{
			id: 4,
			title: '제목4',
			local: '지역4',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디4',
		},
		{
			id: 5,
			title: '제목5',
			local: '지역5',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디5',
		},
		{
			id: 6,
			title: '제목6',
			local: '지역6',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디6',
		},
		{
			id: 7,
			title: '제목7',
			local: '지역7',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디7',
		},
		{
			id: 8,
			title: '제목8',
			local: '지역8',
			image: 'https://example.com/image1.jpg',
			memberId: '아이디8',
		},
		{
			id: 9,
			title: '제목9',
			local: '지역9',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디9',
		},
		{
			id: 10,
			title: '제목10',
			local: '지역10',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디10',
		},
		{
			id: 11,
			title: '제목11',
			local: '지역11',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디11',
		},
		{
			id: 12,
			title: '제목12',
			local: '지역12',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디12',
		},
		{
			id: 13,
			title: '제목13',
			local: '지역13',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디13',
		},
		{
			id: 14,
			title: '제목14',
			local: '지역14',
			image: 'https://example.com/image2.jpg',
			memberId: '아이디14',
		},
		// 추가적인 카드 데이터를 필요한 만큼 추가할 수 있음
	]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // '스무스' 스크롤링
		});
	};

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
				<div className='button-container'>
					<Link to='/new-post'>
						<button className='post-button'>글 작성</button>
					</Link>
					<button
						className='top-button'
						onClick={scrollToTop}
					>
						Top^
					</button>
				</div>
			</div>
		</>
	);
};

export default BoardList;
