// filepath: client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, NavLink } from 'react-router-dom';
import './App.css';
import ChatDashboardPage from './pages/ChatDashboardPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Changed from app to app-container for clarity */}
        <header className="app-header-navbar">
          <div className="navbar-brand">
            <Link to="/">ChatAI</Link> {/* Link brand to chat page */}
          </div>
          <nav className="navbar-links">
            <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>Chat</NavLink>
            <NavLink to="/features" className={({ isActive }) => isActive ? 'active' : ''}>Features</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          </nav>
        </header>

        <main className="main-content-area">
          <Routes>
            <Route path="/chat" element={<ChatDashboardPage />} /> {/* Default to /chat */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/" element={<Navigate replace to="/chat" />} /> {/* Redirect base path to /chat */}
            <Route path="*" element={<Navigate to="/chat" />} /> {/* Redirect any other path to /chat */}
          </Routes>
        </main>
        
        {/* <ChatAIButton /> */}

        <footer className="app-footer">
          <p>Made by Daivesh using Gemini &copy; 2024 ChatAI. All rights reserved.</p> {/* Updated footer text */}
        </footer>
      </div>
    </Router>
  );
}

export default App;