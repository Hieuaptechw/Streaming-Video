import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import './UploadSection.css';

const UploadSection = ({ onUploadComplete = () => {} }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('0 B/s');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const uploadStartTimeRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond < 1024) {
      return Math.round(bytesPerSecond) + ' B/s';
    } else if (bytesPerSecond < 1024 * 1024) {
      return Math.round(bytesPerSecond / 1024) + ' KB/s';
    } else {
      return (bytesPerSecond / (1024 * 1024)).toFixed(1) + ' MB/s';
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (MP4, MOV, AVI, etc.)');
      return;
    }

    setSelectedFile(file);
    setUploadComplete(false);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setUploadComplete(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const startUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    uploadStartTimeRef.current = Date.now();

    const formData = new FormData();
    formData.append('video', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5001/api/videos/upload-and-process', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setUploadProgress(percent);

        const elapsed = (Date.now() - uploadStartTimeRef.current) / 1000;
        const speed = event.loaded / elapsed;
        setUploadSpeed(formatSpeed(speed));
      }
    };

    let responseText = '';

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.LOADING) {
        const newText = xhr.responseText.substring(responseText.length);
        responseText += newText;

        const lines = newText.split('\n');
        lines.forEach(line => {
          if (line.includes('Tiến trình:')) {
            const progressMatch = line.match(/Tiến trình:\s*([\d.]+)%/);
            if (progressMatch) {
              
            }
          }
        });
      }

      if (xhr.readyState === XMLHttpRequest.DONE) {
        setIsUploading(false);

        if (xhr.status === 200) {
          setUploadComplete(true);

          const hlsUrlMatch = responseText.match(/HLS URL:\s*(.+)/);
          const hlsUrl = hlsUrlMatch ? hlsUrlMatch[1] : null;
          const parts = hlsUrl.split('/');
          const videoFolder = parts.length >= 3 ? parts[2] : null;
          const thumbnail = videoFolder
  ? `/hls/${videoFolder}/${videoFolder}.jpg`
  : 'https://via.placeholder.com/300x169?text=No+Thumbnail';
          if (typeof onUploadComplete === 'function') {
            onUploadComplete({
              filename: selectedFile.name,
              hlsUrl: hlsUrl,
              originalFile: selectedFile,
             thumbnail: thumbnail
            });
          }
        } else {
          alert('Upload failed: ' + xhr.statusText);
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      alert('Upload error occurred');
    };

    xhr.send(formData);
  };

  return (
    <div className="upload-container">
      <h1>Upload Your Video</h1>

      <div
        className="upload-area"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FaCloudUploadAlt className="upload-icon" />
        <p>Drag & drop your video file here</p>
        <span>or click to browse files (MP4, MOV, AVI up to 1GB)</span>
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <p><strong>Selected file:</strong> {selectedFile.name}</p>
          <p><strong>File size:</strong> {formatFileSize(selectedFile.size)}</p>
        </div>
      )}

      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{Math.round(uploadProgress)}%</span>
            <span>{uploadSpeed}</span>
          </div>
        </div>
      )}

      {selectedFile && !isUploading && uploadProgress === 0 && (
        <button className="upload-btn" onClick={startUpload}>
          Start Upload
        </button>
      )}

      {uploadComplete && (
        <div className="success-message">
          <FaCheckCircle /> Upload completed successfully!
        </div>
      )}
    </div>
  );
};

export default UploadSection;
