import React from 'react';
import './Tabs.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-container">
      <button 
        className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
        onClick={() => setActiveTab('upload')}
      >
        Upload Video
      </button>
      <button 
        className={`tab ${activeTab === 'library' ? 'active' : ''}`}
        onClick={() => setActiveTab('library')}
      >
        Video Library
      </button>
    </div>
  );
};

export default Tabs;