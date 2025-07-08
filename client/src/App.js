import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Tabs from './components/Tabs/Tabs';
import UploadSection from './components/UploadSection/UploadSection';
import VideoLibrary from './components/VideoLibrary/VideoLibrary';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [videos, setVideos] = useState([
  
  ]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

const handleUploadComplete = (file) => {

  if (!file || !file.filename) {
    console.warn("Invalid file:", file);
    return;
  }

  const newVideo = {
    id: Date.now(),
    title: file.filename.replace(/\.[^/.]+$/, ""),
    size: formatFileSize(file.originalFile.size || 0),
    date: 'Just now',
    hlsUrl: "http://localhost:5001"+file.hlsUrl,
    thumbnail:  "http://localhost:5001"+file.thumbnail,

  };

  setVideos(prev => [newVideo, ...prev]);
  setActiveTab('library');
};

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const playVideo = (video) => {
    setCurrentVideo(video);
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    if (currentVideo?.file) {
      URL.revokeObjectURL(currentVideo.file);
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'upload' && (
        <div className="content-section active">
          <UploadSection onUploadComplete={handleUploadComplete} />
        </div>
      )}
      
      {activeTab === 'library' && (
        <div className="content-section active">
         
          <VideoLibrary videos={videos} onVideoClick={playVideo} />
        </div>
      )}
      
      {showPlayer && (
        <VideoPlayer video={currentVideo} onClose={closePlayer} />
      )}
    </div>
  );
}

export default App;