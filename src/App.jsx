import "./App.css";
import styled from 'styled-components';
import Main from "./components/Main";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Header from './components/Header';

function App() {
  return (
    <>
      <Header>
        <div>
          <Button text={"검색"} />
        </div>
      </Header>
      <Main />
      <Footer />
    </>
  );
}

export default App;
