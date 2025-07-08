import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { FaTimes } from 'react-icons/fa';
import './VideoPlayer.css';

const VideoPlayer = ({ video, onClose }) => {

  const videoRef = useRef(null);


  useEffect(() => {
    if (!video || !video.hlsUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.hlsUrl); 
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = video.hlsUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }
  }, [video]);
  if (!video) return null;

  return (
    <div className="video-player-container">
      <FaTimes className="close-player" onClick={onClose} />
      <video
        ref={videoRef}
        controls
        className="video-player"
      >
        Your browser does not support HLS playback.
      </video>
    </div>
  );
};

export default VideoPlayer;
