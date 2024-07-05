import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="fixed top-0 left-0 right-0 z-10"/>
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
