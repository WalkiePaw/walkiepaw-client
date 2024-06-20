import BoardList from './page/BoardList/BoardList';
import Home from './page/Home/Home';
import Layout from './Layout';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Notfound from './components/Notfound';
import MyPage from './pages/MyPage';
import CustomerService from './pages/CustomerService';
import NewPostForm from './page/\bPost/NewPostForm';

function App() {
  const nav = useNavigate();
  const onClickButton = () => {
    nav('/new');
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={'/MyPage'}>MyPage</Link>
        <Link to={'/CustomerService'}>CustomerService</Link>
      </div>
      <Routes>
        <Route path="*" element={<Notfound />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board-list" element={<BoardList />} />
          <Route path="board-list1" element={<BoardList />} />
          <Route path="new-post" element={<NewPostForm />}></Route>
          <Route path="MyPage" element={<MyPage />} />
          <Route path="CustomerService" element={<CustomerService />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
