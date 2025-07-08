const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { VIDEO_FOLDER, HLS_FOLDER, PORT } = require('./src/config/constants');
const videoRoutes = require('./src/routes/video.routes');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
const absoluteVideoPath = path.join(__dirname, VIDEO_FOLDER);
const absoluteHlsPath = path.join(__dirname, HLS_FOLDER);
app.use('/videos', express.static(absoluteVideoPath));
app.use('/hls', express.static(absoluteHlsPath));
app.use('/api/videos', videoRoutes);
async function startServer() {
    try {
        await fs.ensureDir(absoluteVideoPath);
        await fs.ensureDir(absoluteHlsPath);

        app.listen(PORT, () => {
            console.log(`API Server running at http://localhost:${PORT}`);
            console.log(`API Endpoints:`);
            console.log(`- GET  /api/videos                         → Danh sách video`);
            console.log(`- GET  /api/videos/:filename               → Thông tin video`);
            console.log(`- POST /api/videos/upload                  → Upload video`);
            console.log(`- POST /api/videos/upload-and-process      → Chuyển mp4 → HLS`);
          
        });
    } catch (err) {
        console.error('Lỗi khởi động server:', err);
        process.exit(1);
    }
}

startServer();
