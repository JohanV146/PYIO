import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from "./Menu";
import RutasOptimas from "./components/RutasOptimas";
import BinarySearchTree from "./components/BinarySearchTree";
import Knapsack from "./components/Knapsack"

function App() {
  return (
    <div 
      className="App"
      style={{ backgroundColor: "#040d13", height: "100vh" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/knapsack" element={<Knapsack />} />
          <Route path="/RutasOptimas" element={<RutasOptimas />} />
          <Route path="/BinarySearchTree" element={<BinarySearchTree />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
