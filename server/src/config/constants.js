const path = require('path');

module.exports = {
   VIDEO_FOLDER: path.join('src', 'videos'),
    HLS_FOLDER: path.join('src', 'videos', 'hls'),
    HLS_SEGMENT_TIME: 10,
    SUPPORTED_FORMATS: ['.mp4', '.mov', '.mkv'],
    PORT: process.env.PORT || 5001
    
};