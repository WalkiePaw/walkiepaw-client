// src/components/Header

import React from 'react';

const Header = ({ children }) => {
	return (
		<header>
			<h2>이것은 헤더 입니다.</h2>
			{children} {}
		</header>
	);
};

export default Header;
