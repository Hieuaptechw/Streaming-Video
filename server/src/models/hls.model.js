const fs = require('fs-extra');
const path = require('path');
const { HLS_FOLDER } = require('../config/constants');

class HlsModel {
    static async getHlsPath(videoFilename) {
        const hlsDir = path.join(HLS_FOLDER, videoFilename.replace(/\.[^/.]+$/, ""));
        const playlistPath = path.join(hlsDir, 'playlist.m3u8');
        
        const exists = await fs.pathExists(playlistPath);
        return exists ? playlistPath : null;
    }

    static async createHlsDir(videoFilename) {
        const hlsDir = path.join(HLS_FOLDER, videoFilename.replace(/\.[^/.]+$/, ""));
        await fs.ensureDir(hlsDir);
        return hlsDir;
    }
}

module.exports = HlsModel;