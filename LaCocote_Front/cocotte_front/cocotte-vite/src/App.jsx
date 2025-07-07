// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import Menu from "./Components/Menu/Menu";
import WorkArea from "./Components/WorkArea/WorkArea";

function App() {
  return (
    <>
      <main className="main">
        <Header />
        <div className="main-container">
          <Menu />
          <div className="mc-line"></div>
          <WorkArea />
        </div>
      </main>
    </>
  );
}

export default App;
