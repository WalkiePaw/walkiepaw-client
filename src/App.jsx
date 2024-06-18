import { Route, Routes } from 'react-router-dom';
import BoardList from './page/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';

export default function App() {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={<Layout />}
				>
					<Route
						index
						element={<Home />}
					></Route>
					<Route
						path='board-list'
						element={<BoardList />}
					></Route>
					<Route
						path='board-list1'
						element={<BoardList />}
					></Route>
				</Route>
			</Routes>
		</>
	);
}
