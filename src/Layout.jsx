import { Outlet, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './pages/Button';

export default function Layout() {
  return (
    <div>
      <Header>
        <div>
          <Link to={"/"}>Home</Link>
        </div>
        <div>
          <Button text={"검색"} />
        </div>
      </Header>
      <Outlet />
      <Footer />
    </div>
  );
}
