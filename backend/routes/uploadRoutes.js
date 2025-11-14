const express = require('express');
const multer = require('multer');
const { put ,del} = require("@vercel/blob");

const router = express.Router();

// Use memory storage (disk is not allowed on Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, PNG, WEBP files are allowed"));
    }
  },
});

// ----------------------
// Upload Route
// ----------------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `img-${Date.now()}-${req.file.originalname}`;

    // Upload directly to Vercel Blob Storage (NO TOKEN NEEDED)
    const blob = await put(fileName, req.file.buffer, {
      access: "public",
      token:process.env.BLOB_TOKEN
    });

    return res.status(201).json({
    
      imageUrl: blob.url, // public URL
  });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});











router.delete("/delete", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "url required" });

    await del(url);

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
