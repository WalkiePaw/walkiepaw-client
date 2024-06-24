import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BoardList from './pages/BoardList/BoardList';
import Home from './pages/Home/Home';
import Layout from './Layout';
import Notfound from './components/Notfound';
import MyPage from './pages/MyPage';
import MyHistory from './pages/MyHistory';
import MySettings from './pages/MySettings';
import MyReview from './pages/MyReview';
import MembershipWithdrawal from './pages/MembershipWithdrawal';
import CustomerService from './pages/CustomerService';
import MyInformation from './pages/MyInformation';
import NewPostForm from './pages/Post/New/NewPostForm';
import ModifyPostForm from './pages/Post/Modify/ModifyPostForm';
import Login from './pages/Login';
import SignUpForm from './pages/SignUpForm';
import PostView from './pages/PostView/PostView';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<Notfound />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyHistory" element={<MyHistory />} />
          <Route path="/MyReview" element={<MyReview />} />
          <Route path="/MyInformation" element={<MyInformation />} />
          <Route path="/CustomerService" element={<CustomerService />} />
          <Route path="/MySettings" element={<MySettings />} />
          <Route
            path="/MembershipWithdrawal"
            element={<MembershipWithdrawal />}
          />
          <Route index element={<Home />} />
          <Route path="board-list" element={<BoardList />} />
          <Route path="new-post" element={<NewPostForm />} />
          <Route path="modify-post/:postId" element={<ModifyPostForm />} />
          <Route path="login" element={<Login />} />
          <Route path="signupform" element={<SignUpForm />} />
          <Route path="post/:postId" element={<PostView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
