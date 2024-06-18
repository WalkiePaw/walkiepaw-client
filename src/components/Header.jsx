// src/components/Header

import React from 'react';
import logo from '../assets/logo.png';// 로고 이미지 파일 경로

const Header = ({ children }) => {
	return (
		<header>
			<div>
				<div>
				<	img src={ logo } alt="Logo" />
				</div>

				<nav>
		 			<ul>
						<li>
							산책
						</li>
						<li>
							알바
						</li>
						<li>
							채팅
						</li>
					</ul>
				</nav>

				{children} {}
			</div>
		</header>
	);
};

export default Header;
