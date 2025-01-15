import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from "./Menu";
import RutasOptimas from "./RutasOptimas";

function App() {
  return (
    <div 
      className="App"
      style={{ backgroundColor: "#040d13", height: "100vh" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/rutas-optimas" element={<RutasOptimas />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
