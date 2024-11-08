// utils/uploadImageUtil.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/suspects'; // Customize directory as needed
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
    }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File is not an image'), false);
    }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
