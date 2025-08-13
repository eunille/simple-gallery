const multer = require("multer");
const path = require("path");
const fs = require("fs");
const env = require("../config/env");

// Ensure upload directory exists
const uploadDir = path.resolve(env.UPLOAD_PATH || "./public/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: fileFilter,
});

// Single file upload middleware
const uploadSingle = upload.single("image");

// Multiple files upload middleware
const uploadMultiple = upload.array("images", 10); // Max 10 images

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadDir,
};
