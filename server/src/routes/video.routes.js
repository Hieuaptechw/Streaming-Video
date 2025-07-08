const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const upload = require('../middleware/upload.middleware');

router.get('/', videoController.listVideos);
router.get('/:filename', videoController.getVideoInfo);
router.post('/process', videoController.processVideo);
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.post('/upload-and-process', upload.single('video'), videoController.uploadAndProcess);

module.exports = router;
