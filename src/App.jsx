import './App.css';
import Main from './components/Main';
import Footer from './components/Footer';
import Button from './components/Button';
import Header from './components/Header';

function App() {
	return (
		<>
			<Header>
				<div>
					<Button text={'검색'} />
				</div>
			</Header>
			<div>
				<Main>
          
        </Main>
			</div>
			<Footer />
		</>
	);
}

export default App;
