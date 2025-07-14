import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;