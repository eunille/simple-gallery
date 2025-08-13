const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const albumRoutes = require("./albums");
const imageRoutes = require("./images");

// Mount routes
router.use("/auth", authRoutes);
router.use("/albums", albumRoutes);
router.use("/images", imageRoutes);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Gallery API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/profile": "Get user profile (protected)",
      },
      albums: {
        "GET /api/albums": "Get all albums (protected)",
        "POST /api/albums": "Create a new album (protected)",
        "GET /api/albums/:id": "Get album by ID (protected)",
        "PUT /api/albums/:id": "Update album (protected)",
        "DELETE /api/albums/:id": "Delete album (protected)",
        "GET /api/albums/stats": "Get album statistics (protected)",
      },
      images: {
        "GET /api/images/album/:albumId": "Get all images in an album (protected)",
        "POST /api/images/album/:albumId": "Upload single image (protected)",
        "POST /api/images/album/:albumId/multiple": "Upload multiple images (protected)",
        "GET /api/images/:id": "Get image by ID (protected)",
        "PUT /api/images/:id": "Update image (protected)",
        "DELETE /api/images/:id": "Delete image (protected)",
        "GET /api/images/stats": "Get image statistics (protected)",
      },
    },
  });
});

module.exports = router;
