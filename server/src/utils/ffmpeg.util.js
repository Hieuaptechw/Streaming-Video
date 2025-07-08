const ffmpeg = require('fluent-ffmpeg');

function setupFfmpeg() {
   
    ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH || 'ffmpeg');
}

function convertToHls(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
        const command = ffmpeg(inputPath)
            .outputOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                `-hls_time ${options.segmentTime || 10}`,
                '-hls_list_size 0',
                '-f hls'
            ])
            .output(outputPath);
        
        if (options.onProgress) {
            command.on('progress', options.onProgress);
        }
        
        command
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
}

module.exports = {
    setupFfmpeg,
    convertToHls
};