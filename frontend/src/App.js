import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/Analysis';
import Biological from './components/Biological';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/Biological" element={<Biological />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
