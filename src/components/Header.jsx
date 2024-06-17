// src/components/Header
import React from 'react';
const Header = ({ children }) => {
    return (
        <header>
            <div>
                <div>
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
