const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

// use a stable absolute uploads directory (process.cwd() is safer for different launch contexts)
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
console.log('Uploads directory:', uploadDir);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `img-${Date.now()}-${Math.floor(Math.random() * 1e6)}${ext}`;
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  const allowed = /^image\/(jpeg|jpg|png|webp)$/;
  if (file && file.mimetype && allowed.test(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      console.warn('No file in request');
      return res.status(400).json({ message: 'No file uploaded. Ensure field name is "image".' });
    }
    // log saved file info
    console.log('Uploaded file saved:', req.file.filename, 'size:', req.file.size);
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({ image: imageUrl });
  });
});

module.exports = router;
