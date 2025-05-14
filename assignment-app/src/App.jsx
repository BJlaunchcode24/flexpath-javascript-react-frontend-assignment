import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div style={{ marginLeft: "2rem", display: "flex", alignItems: "center" }}>
            <Link className="navbar-brand me-4" to="/">User Behavior Data</Link>
            <Link className="nav-link text-white" to="/search">Search Through Dataset</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;