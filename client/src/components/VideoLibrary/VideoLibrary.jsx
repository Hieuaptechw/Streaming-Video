import React from 'react';
import VideoCard from './VideoCard';
import './VideoLibrary.css';

const VideoLibrary = ({ videos, onVideoClick }) => {
  return (
    <div className="video-library">
      <h2 className="section-title">My Video Library</h2>
      
      <div className="video-grid">
        {videos.map(video => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;