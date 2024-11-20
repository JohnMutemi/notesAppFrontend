import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import HomePage from './components/HomePage';
import HtmlNotes from './components/HtmlNotes'; // Import the HtmlNotes component

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Define routes for different pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/html" element={<HtmlNotes />} />{' '}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
