import BoardList from './page/BoardList/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';
import "./App.css";
import styled from 'styled-components';
import { Routes, Route, Link, useNavigate } from "react-router-dom"
<<<<<<< HEAD
import Footer from "./components/Footer";
import Button from "./pages/Button";
import Header from './components/Header';
=======

>>>>>>> 0bfa83d6651e36db3e8b41a95a33d0575ccdcee9
import Notfound from './components/Notfound'
import MyPage from './pages/MyPage';
import MyHistory from './pages/MyHistory';
import MySettings from "./pages/MySettings"
import MyReview from './pages/MyReview';
import MembershipWithdrawal from "./pages/MembershipWithdrawal";
import CustomerService from "./pages/CustomerService";
<<<<<<< HEAD
import Login from './pages/Login';
import SignUpForm from './pages/SignUpForm';

=======
import MyInformation from './pages/MyInformation';
import NewPostForm from './page/\bPost/NewPostForm';
>>>>>>> 0bfa83d6651e36db3e8b41a95a33d0575ccdcee9

function App() {
  const nav = useNavigate();
  const onClickButton = () => {
    nav('/new');
  };

  return (
    <>
      <Routes>
<<<<<<< HEAD
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
=======
        <Route path='/' element={<Layout />}>
          <Route path="*" element={<Notfound />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyHistory" element={<MyHistory />} />
          <Route path="MyReview" element={<MyReview />} />
          <Route path="/MyInformation" element={<MyInformation />} />
          <Route path="/CustomerService" element={<CustomerService />} />
          <Route path="/MySettings" element={<MySettings />} />
          <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
          <Route index element={<Home />} />
          <Route path='board-list'element={<BoardList />} />
          <Route path='board-list1' element={<BoardList />} />
          <Route path="new-post" element={<NewPostForm />}></Route>
>>>>>>> 0bfa83d6651e36db3e8b41a95a33d0575ccdcee9
				</Route>

      </Routes>
    </>
  );
}

export default App;
