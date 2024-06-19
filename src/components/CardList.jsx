import React from 'react';
import './CardList.css';

const CardList = ({ title, local, image, memberId }) => {
	return (
		<div className='CardStyled'>
			<div className='Locals'>
				<div className='MemberId'>{memberId}</div>
				<div className='Local'>{local}</div>
			</div>
			<div className='Title'>{title}</div>
			<div className='CardImageBox'>
				<img
					className='CardImage'
					src={image}
					alt='image'
				/>
			</div>
		</div>
	);
};

export default CardList;
