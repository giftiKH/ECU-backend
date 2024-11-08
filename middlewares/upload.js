// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Define storage engine
const storage = multer.diskStorage({
  destination: './uploads', // where files will be saved
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Files of the following types only - Images, Videos!');
    }
  }
}).single('file');

module.exports = upload;
