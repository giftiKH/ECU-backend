const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Define storage for multer
const storage = (folder) => {
    const dir = path.join(__dirname, 'uploads', folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4();
            const ext = path.extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
        }
    });
};

const uploadMiddleware = (folder) => {
    return multer({ 
        storage: storage(folder),
        limits: { fileSize: 5 * 1024 * 1024 } // Optional: Set file size limit
    }).single('file');
};

module.exports = { uploadMiddleware };
