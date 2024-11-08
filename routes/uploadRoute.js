const express = require('express');
const path = require('path');
const { uploadMiddleware } = require('../utils/uploadUtil');

const router = express.Router();

// Route to handle file uploads
router.post('/:folder', (req, res, next) => {
    const folder = req.params.folder;
    const upload = uploadMiddleware(folder);
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload middleware error:', err);
            return res.status(500).json({ error: 'File upload error', details: err.message });
        }
        next();
    });
});


module.exports = router;
