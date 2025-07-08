import React from 'react';
import './VideoLibrary.css';

const VideoCard = ({ video, onClick }) => {
  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <img 
        src={video.thumbnail} 
        alt="Video Thumbnail" 
        className="video-thumbnail" 
      />
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span>{video.size}</span>
          <span>{video.date}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;