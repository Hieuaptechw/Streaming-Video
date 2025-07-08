const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { VIDEO_FOLDER } = require('../config/constants');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../..', VIDEO_FOLDER);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir); 
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'video-' + unique + ext);
    }
});


const upload = multer({ storage });

module.exports = upload;
