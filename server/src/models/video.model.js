const fs = require('fs-extra');
const path = require('path');
const { VIDEO_FOLDER, SUPPORTED_FORMATS } = require('../config/constants');

class VideoModel {
    static async listVideos() {
        const files = await fs.readdir(VIDEO_FOLDER);
        return files.filter(file => 
            SUPPORTED_FORMATS.some(format => file.endsWith(format))
        );
    }

    static async getVideoPath(filename) {
        const videoPath = path.join(VIDEO_FOLDER, filename);
        const exists = await fs.pathExists(videoPath);
        return exists ? videoPath : null;
    }
}

module.exports = VideoModel;