import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Layout() {
  return (
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="flex-grow w-full">
          <Outlet/>
        </main>
        <Footer/>
      </div>
  )
      ;
}
