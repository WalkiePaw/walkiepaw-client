import React, { useState } from 'react';

const NewPostForm = ({ addPost }) => {
	const [title, setTitle] = useState('');
	const [local, setLocal] = useState('');
	const [image, setImage] = useState('');
	const [memberId, setMemberId] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const newPost = {
			title,
			local,
			image,
			memberId,
		};
		addPost(newPost);
		setTitle('');
		setLocal('');
		setImage('');
		setMemberId('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				placeholder='제목'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<input
				type='text'
				placeholder='지역'
				value={local}
				onChange={(e) => setLocal(e.target.value)}
			/>
			<input
				type='text'
				placeholder='이미지 URL'
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>
			<input
				type='text'
				placeholder='아이디'
				value={memberId}
				onChange={(e) => setMemberId(e.target.value)}
			/>
			<button type='submit'>게시글 추가</button>
		</form>
	);
};

export default NewPostForm;
