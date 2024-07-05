import BoardList from './pages/BoardList/BoardList';
import Home from './pages/Home/Home';
import Layout from './Layout';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Notfound from './components/Notfound';
import MyPage from './pages/MyPage/MyPage';
import MyPageLayout from './pages/MyPage/MyPageLayout';
import MyHistory from './pages/MyPage/MyHistory';
import MySettings from './pages/MyPage/MySettings';
import MembershipWithdrawal from './pages/MyPage/MembershipWithdrawal';

import MyInformation from './pages/MyPage/MyInformation';
import NewPostForm from './pages/Post/New/NewPostForm';
import Login from './pages/Login';
import Dashboard from '/src/pages/Dashboard/Dashboard';
import PostList from '/src/pages/Dashboard/PostList';
import Introduction from '/src/pages/Dashboard/Introduction';
import Preferences from './pages/MyPage/Preferences';
import React from 'react';
import ModifyPostForm from './pages/Post/Modify/ModifyPostForm';
import CustomerService from './pages/MyPage/CustomerService';
import PostView from './pages/PostView/PostView';

import MyTransaction from './pages/MyPage/MyTransaction.jsx';
import KakaoLoginCallback from './components/OAuth/KakaoLoginCallback.jsx';
import NaverLoginCallback from './components/OAuth/NaverLoginCallback.jsx';
import GoogleLoginCallback from './components/OAuth/GoogleLoginCallback.jsx';
import Review from './components/Review.jsx';
import SignUp from './pages/OAuth/SignUp.jsx';
import ChatPage from './pages/chatroom/ChatPage.jsx';
import CSManagement from './admin/CSManagement.jsx';
import Admin from './admin/Admin.jsx';
import MemberList from './admin/MemberList.jsx';
import QnaList from './pages/MyPage/QnaList.jsx';
import ReportManagement from './admin/ReportManagement.jsx';

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
            <Route path="transaction" element={<MyTransaction />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="information" element={<MyInformation />} />
            <Route path="customer-service" element={<CustomerService />} />
            <Route path="settings" element={<MySettings />} />
            <Route path="review" element={<Review />} />
            <Route path="withdrawal" element={<MembershipWithdrawal />} />
            <Route path="qna-list" element={<QnaList />} />
          </Route>

          <Route index element={<Home />} />
          <Route path="recruit" element={<BoardList category="JOB_OPENING" />} />
          <Route path="jobs" element={<BoardList category="JOB_SEARCH" />} />
          <Route path="new-post" element={<NewPostForm />}></Route>
          <Route path="modify-post/:postId" element={<ModifyPostForm />} />
          <Route path="login" element={<Login />} />
          <Route path="/login/kakao" element={<KakaoLoginCallback />} />
          <Route path="/login/naver" element={<NaverLoginCallback />} />
          <Route path="/login/google" element={<GoogleLoginCallback />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="chatpage" element={<ChatPage />} />
          <Route path="post/:postId" element={<PostView />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Introduction />} />
            <Route path="postlist" element={<PostList />} />
            <Route path="review" element={<Review />} />
          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route path="member-list" element={<MemberList />} />
            <Route path="report-mngmt" element={<ReportManagement />} />
            <Route path="cs-mngmt" element={<CSManagement />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
