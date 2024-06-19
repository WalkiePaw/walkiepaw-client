import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom"

import Main from "./components/Main";
import Footer from "./components/Footer";
import Button from "./pages/Button";
import Header from './components/Header';
import Notfound from './components/Notfound'
import MyPage from './pages/MyPage';
import CustomerService from "./pages/CustomerService";

function App() {
  const nav = useNavigate();

  const onClickButton = () => {
    nav("/new");
  };

  return (
    <>
      <Header>
      <div>
        <Link to={"/"}>Main</Link>
      </div>
        <div>
          <Button text={"검색"} />
        </div>
      </Header>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={"/MyPage"}>MyPage</Link>
          <Link to={"/CustomerService"}>CustomerService</Link>
        </div>
      <Footer />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/CustomerService" element={<CustomerService />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;