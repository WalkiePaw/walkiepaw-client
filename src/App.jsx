import BoardList from './page/BoardList/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';
import "./App.css";
import styled from 'styled-components';
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import Notfound from './components/Notfound'
import MyPage from './pages/MyPage';
import MyHistory from './pages/MyHistory';
import MySettings from "./pages/MySettings"
import MyReview from './pages/MyReview';
import MembershipWithdrawal from "./pages/MembershipWithdrawal";
import CustomerService from "./pages/CustomerService";
import MyInformation from './pages/MyInformation';
import NewPostForm from './page/Post/NewPostForm';
import Login from './pages/Login';
import SignUpForm from './pages/OAuth/SignUpForm.jsx';


function App() {
  const nav = useNavigate();
  const onClickButton = () => {
    nav('/new');
  };
  return (
      <>
        <Routes>
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
            <Route path="login" element={<Login />} />
            <Route path="signupform" element={<SignUpForm />} />
          </Route>
        </Routes>
      </>
  );
}
export default App;