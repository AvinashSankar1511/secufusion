import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Scanning from "./pages/Scanning";
import ScanResultsPage from './pages/ScanResultsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/scanning" element={<Scanning/>}/> 
        <Route path="/output"   element={<ScanResultsPage/>}/>
        
      </Routes>
    </Router>
  </StrictMode>
);
