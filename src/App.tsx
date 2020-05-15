import React, { useEffect, useContext } from "react";
import "./App.css";

import { DataProvider, DataContext } from "./components/DataContext";
import MainPage from "./MainPage";

function App() {
  return (
    <div className="App">
      <DataProvider>
        <MainPage />
      </DataProvider>
    </div>
  );
}

export default App;
