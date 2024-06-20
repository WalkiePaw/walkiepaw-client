import BoardList from './page/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';
import "./App.css";
import styled from 'styled-components';
import { Routes, Route, Link, useNavigate } from "react-router-dom"

import Notfound from './components/Notfound'
import MyPage from './pages/MyPage';
import MyHistory from './pages/MyHistory';
import MySettings from "./pages/MySettings"
import MyTown from './pages/MyTown';
import MembershipWithdrawal from "./pages/MembershipWithdrawal";
import CustomerService from "./pages/CustomerService";
import MyInformation from './pages/MyInformation';

function App() {
	
  const nav = useNavigate();

  const onClickButton = () => {
    nav("/new");
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path="*" element={<Notfound />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyHistory" element={<MyHistory />} />
          <Route path="/MyTown" element={<MyTown />} />
          <Route path="/MyInformation" element={<MyInformation />} />
          <Route path="/CustomerService" element={<CustomerService />} />
          <Route path="/MySettings" element={<MySettings />} />
          <Route path="/MembershipWithdrawal" element={<MembershipWithdrawal />} />
          <Route index element={<Home />} />
          <Route path='board-list'element={<BoardList />} />
          <Route path='board-list1' element={<BoardList />} />
				</Route>
      </Routes>
    </>
  );
}

export default App;
