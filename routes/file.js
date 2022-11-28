const express = require('express');

const FileController = require('../controllers/FileController')
const router = express.Router();

const multer = require('multer')

const upload = multer({
    dest: 'uploads'
})

router.get('/', FileController.getIndex)

router.post('/upload', upload.single("file"), FileController.postFile)

router.get('/file/:id', FileController.handleDownload)
router.post('/file/:id', FileController.handleDownload)

module.exports = router