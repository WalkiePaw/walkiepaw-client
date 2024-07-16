import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setInitialState, verifyToken } from './store/AuthSlice';
import ProtectedRoute from './store/ProtectedRoute.jsx';
import BoardList from './pages/boardlist/BoardList.jsx';
import Home from './pages/home/Home';
import Layout from './Layout';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Notfound from './components/Notfound';
import MyPage from './pages/mypage/MyPage';
import MyPageLayout from './pages/mypage/MyPageLayout';
import MyHistory from './pages/mypage/MyHistory';
import MySettings from './pages/mypage/MySettings';
import MembershipWithdrawal from './pages/mypage/MembershipWithdrawal';

import MyInformation from './pages/mypage/MyInformation';
import NewPostForm from './pages/post/new/NewPostForm';
import Login from './pages/Login';
import Dashboard from '/src/pages/dashboard/Dashboard';
import PostList from '/src/pages/dashboard/PostList';
import Introduction from '/src/pages/dashboard/Introduction';
import Preferences from './pages/mypage/Preferences';
import ModifyPostForm from './pages/post/modify/ModifyPostForm.jsx';
import CustomerService from './pages/mypage/CustomerService';

import MyTransaction from './pages/mypage/MyTransaction.jsx';
import Review from './components/Review.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import ChatPage from './pages/chatroom/ChatPage.jsx';
import CSManagement from './admin/CSManagement.jsx';
import Admin from './admin/Admin.jsx';
import MemberList from './admin/MemberList.jsx';
import QnaList from './pages/mypage/QnaList.jsx';
import ReportManagement from './admin/ReportManagement.jsx';

import ParticleCursor from './components/ParticleCursor.jsx';
import PostView from './pages/postView/PostView.jsx';
import ProtectedChatRoute from './store/ProtectedChatRoute.jsx';
import ChatLayout from "./components/chat/ChatLayout.jsx";
import UseSocialLogin from "./store/actions/UseSocailLogin.jsx";
import DashboardReview from './pages/dashboard/DashboardReview.jsx';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nav = useNavigate();
  const onClickButton = () => {
    nav('/new');
  };

  useEffect(() => {
    // 초기 상태 설정 (로컬 스토리지 기반)
    dispatch(setInitialState());

    // 백그라운드에서 토큰 검증
    if (localStorage.getItem('token')) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return (
    <>
      {/* <ParticleCursor /> */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Notfound />} />

          <Route element={<ProtectedRoute />}>
            <Route path="mypage" element={<MyPageLayout />}>
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
          </Route>

          <Route path="recruit" element={<BoardList category="JOB_OPENING" />} />
          <Route path="jobs" element={<BoardList category="JOB_SEARCH" />} />
          <Route path="new-post" element={<NewPostForm />}></Route>
          <Route path="modify-post/:postId" element={<ModifyPostForm />} />
          <Route path="post/:postId" element={<PostView />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/oauth2/redirect" element={<UseSocialLogin />} />

          <Route element={<ProtectedChatRoute />}>
            <Route path="chat" element={<ChatLayout />}>
              <Route index element={<ChatPage />} />
              <Route path=":chatroomId" element={<ChatPage />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Introduction />} />
            <Route path="postlist" element={<PostList />} />
            <Route path="review" element={<DashboardReview />} />
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
