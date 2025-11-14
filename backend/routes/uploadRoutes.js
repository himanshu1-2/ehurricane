const express = require('express');
const multer = require('multer');
const { put ,del} = require("@vercel/blob");

const router = express.Router();

// Use memory storage (disk is not allowed on Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    const allowed = /^image\/(jpeg|jpg|png|webp)$/;
    if (allowed.test(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Use field name 'image'." });
    }

    // generate safe unique filename
    const ext = req.file.originalname.split('.').pop();
    const filename = `img-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: "public",
    });

    console.log("File uploaded to blob:", blob.url);

    return res.status(201).json({
      image: blob.url, // public CDN URL
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
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
