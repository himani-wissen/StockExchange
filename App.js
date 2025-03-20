import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StockExchangePage from "./components/StockExchangePage";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<StockExchangePage />} />
    </Routes>
  </Router>
  );
}

export default App;