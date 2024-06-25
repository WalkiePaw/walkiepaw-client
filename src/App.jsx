import BoardList from './pages/BoardList/BoardList';
import Home from './pages/Home/Home';
import Layout from './Layout';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Notfound from './components/Notfound';
import MyPage from './pages/MyPage/MyPage';
import MyPageLayout from './pages/MyPage/MyPageLayout';
import MyHistory from './pages/MyPage/MyHistory';
import MySettings from './pages/MyPage/MySettings';
import MyReview from './pages/MyPage/MyReview';
import MembershipWithdrawal from './pages/MyPage/MembershipWithdrawal';
import CustomerService from './pages/MyPage/CustomerService';
import MyInformation from './pages/MyPage/MyInformation';
import NewPostForm from './pages/Post/NewPostForm';
import Login from './pages/Login';
import Dashboard from '/src/pages/Dashboard/Dashboard';
import PostList from '/src/pages/Dashboard/PostList';
import Review from '/src/pages/Dashboard/Review';
import Introduction from '/src/pages/Dashboard/Introduction';
import Preferences from './pages/MyPage/Preferences';
import React from 'react';
import ModifyPostForm from './pages/Post/Modify/ModifyPostForm';
import PostView from './pages/PostView/PostView';
import SignUpForm from './pages/OAuth/SignUpForm.jsx';
import ChatPage from "./pages/chatroom/ChatPage.jsx";


function App() {
  const nav = useNavigate();
  const onClickButton = () => {
    nav('/new');
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<Notfound />} />

          <Route path="/mypage" element={<MyPageLayout />}>
            <Route index element={<MyPage />} />
            <Route path="history" element={<MyHistory />} />
            <Route path="review" element={<MyReview />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="information" element={<MyInformation />} />
            <Route path="customer-service" element={<CustomerService />} />
            <Route path="settings" element={<MySettings />} />
            <Route path="withdrawal" element={<MembershipWithdrawal />} />
          </Route>

          <Route index element={<Home />} />
          <Route path="board-list" element={<BoardList />} />
          <Route path="board-list1" element={<BoardList />} />
          <Route path="new-post" element={<NewPostForm />}></Route>
          <Route path="modify-post/:postId" element={<ModifyPostForm />} />
          <Route path="login" element={<Login />} />
          <Route path="signupform" element={<SignUpForm />} />
          <Route path="chatpage" element={<ChatPage />} />
          <Route path="post/:postId" element={<PostView />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Introduction />} />
            <Route path="postlist" element={<PostList />} />
            <Route path="review" element={<Review />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
