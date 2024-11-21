import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import HomePage from './components/HomePage';
import HtmlNotes from './components/HtmlNotes';
import CSS from './components/CSS';
import ReactNotes from './components/ReactNotes';
import PythonNotes from './components/PythonNotes';
import FlaskNotes from './components/FlaskNotes';
import JavaScriptNotes from './components/JavaScriptNotes';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/html" element={<HtmlNotes />} />
            <Route path="/css" element={<CSS />} />
            <Route path="/python" element={<PythonNotes />} />
            <Route path="/js" element={<JavaScriptNotes />} />
            <Route path="/react" element={<ReactNotes />} />
            <Route path="/flask" element={<FlaskNotes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
