import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <a href="#" className="logo">NETFLIX</a>
      <div className="nav-links">
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('upload'); }}
        >
          Upload
        </a>
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'library' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('library'); }}
        >
          My Videos
        </a>
      </div>
    </nav>
  );
};

export default Navbar;