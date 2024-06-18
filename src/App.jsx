import { Route, Routes } from 'react-router-dom';
import BoardList from './page/BoardList';
import Home from './page/Home/Home';

export default function App() {
	return (
		<>
			{/* <Header>
				<div>
					<Button text={'검색'} />
				</div>
			</Header>
			<div>
				<Main></Main>
			</div>
			<Footer /> */}
			<Routes>
				<Route
					path='/'
					element={<Home />}
				></Route>
				<Route
					path='/board-list'
					element={<BoardList />}
				></Route>
			</Routes>
		</>
	);
}
