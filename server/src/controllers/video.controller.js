const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { convertToHls } = require("../utils/ffmpeg.util");

const { spawn } = require("child_process");
const {
  VIDEO_FOLDER,
  HLS_FOLDER,
  SUPPORTED_FORMATS,
  HLS_SEGMENT_TIME,
} = require("../config/constants");

class VideoController {
  async listVideos(req, res) {
    try {
      const videoDir = path.join(__dirname, "../..", VIDEO_FOLDER);
      const files = fs.readdirSync(videoDir);
      const videos = files.filter((file) =>
        SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())
      );
      res.json(videos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to list videos" });
    }
  }

  async getVideoInfo(req, res) {
    try {
      const { filename } = req.params;
      const baseName = filename.replace(/\.[^/.]+$/, "");
      const videoPath = path.join(__dirname, "../..", VIDEO_FOLDER, filename);

      if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: "Video not found" });
      }

      const hlsPath = path.join(
        __dirname,
        "../..",
        HLS_FOLDER,
        baseName,
        "playlist.m3u8"
      );
      const hlsReady = fs.existsSync(hlsPath);

      res.json({
        filename,
        hlsReady,
        hlsPath: hlsReady ? `/hls/${baseName}/playlist.m3u8` : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get video info" });
    }
  }

  async processVideo(req, res) {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
      }

      const baseName = filename.replace(/\.[^/.]+$/, "");
      const inputPath = path.join(__dirname, "../..", VIDEO_FOLDER, filename);
      const outputDir = path.join(__dirname, "../..", HLS_FOLDER, baseName);
      const outputPath = path.join(outputDir, "playlist.m3u8");
const thumbnailOutputPath = path.join(outputDir, `${baseName}.jpg`);
      if (!fs.existsSync(inputPath)) {
        return res.status(404).json({ error: "Video file not found" });
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      if (fs.existsSync(outputPath)) {
        return res.json({
          success: true,
          hlsPath: `/hls/${baseName}/playlist.m3u8`,
        });
      }

      const cmd = `ffmpeg -i "${inputPath}" -codec: copy -start_number 0 -hls_time ${HLS_SEGMENT_TIME} -hls_list_size 0 -f hls "${outputPath}"`;

      exec(cmd, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Failed to process video with FFmpeg" });
        }

        return res.json({
          success: true,
          hlsPath: `/hls/${baseName}/playlist.m3u8`,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing video" });
    }
  }
  async uploadAndProcess(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
      }

      const filename = req.file.filename;
      const baseName = filename.replace(/\.[^/.]+$/, "");
      const inputPath = req.file.path;
      const outputDir = path.join(__dirname, "../..", HLS_FOLDER, baseName);
      const outputPath = path.join(outputDir, "playlist.m3u8");
      const thumbnailOutputPath = path.join(outputDir, `${baseName}.jpg`);   

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      });
      
      res.write(`Bắt đầu chuyển đổi: ${filename}\n`);

      await convertToHls(inputPath, outputPath, {
        segmentTime: HLS_SEGMENT_TIME,
        onProgress: (progress) => {
          res.write(
            `Tiến trình: ${progress.percent?.toFixed(2)}% | frame: ${
              progress.frames
            } | time: ${progress.timemark}\n`
          );
        },
      });

      res.write(`Hoàn tất chuyển đổi\n`);
       await new Promise((resolve, reject) => {
        const cmd = `ffmpeg -y -i "${inputPath}" -ss 00:00:01 -vframes 1 "${thumbnailOutputPath}"`;
        exec(cmd, (err) => {
          if (err) {
            console.error("Thumbnail generation failed:", err);
            return reject(err);
          }
          res.write(`Thumbnail: /thumbnails/${baseName}.jpg\n`);
          resolve();
        });
      });
      res.write(`HLS URL: /hls/${baseName}/playlist.m3u8\n`);

   
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi xử lý video");
    }
  }

  uploadVideo(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
      }

      const filePath = req.file.path;
      const filename = req.file.filename;

      return res.json({
        success: true,
        message: "Video uploaded successfully",
        filename,
        filePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload video" });
    }
  }
}

module.exports = new VideoController();
