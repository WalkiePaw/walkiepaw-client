import BoardList from './page/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';
import "./App.css";
import styled from 'styled-components';
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import Footer from "./components/Footer";
import Button from "./pages/Button";
import Header from './components/Header';
import Notfound from './components/Notfound'
import MyPage from './pages/MyPage';
import CustomerService from "./pages/CustomerService";
import Login from './pages/Login';
import SignUpForm from './pages/SignUpForm';


function App() {
	
  const nav = useNavigate();

  const onClickButton = () => {
    nav("/new");
  };

  return (
    <>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={"/MyPage"}>MyPage</Link>
          <Link to={"/CustomerService"}>CustomerService</Link>
        </div>
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
            <Route path="login" element={<Login />} />
            <Route path="signupform" element={<SignUpForm />} />
            <Route path="MyPage" element={<MyPage />} />
            <Route path="CustomerService" element={<CustomerService />} />
            <Route path="*" element={<Notfound />} />
				</Route>

      </Routes>
    </>
  );
}

export default App;
