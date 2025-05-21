import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from './pages/Home';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import Docs from './pages/Docs';
import LeaderBoard from './components/LeaderBoard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/docs" element={<Docs />} />
         <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
