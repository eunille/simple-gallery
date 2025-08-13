const express = require("express");
const router = express.Router();
const albumController = require("../controller/albumController");
const { authenticateToken } = require("../middleware/authMiddleware");

// All album routes require authentication
router.use(authenticateToken);

// Get all albums for authenticated user
router.get("/", albumController.getUserAlbums);

// Get album statistics
router.get("/stats", albumController.getAlbumStats);

// Create a new album
router.post("/", albumController.createAlbum);

// Get album by ID
router.get("/:id", albumController.getAlbumById);

// Update album
router.put("/:id", albumController.updateAlbum);

// Delete album
router.delete("/:id", albumController.deleteAlbum);

module.exports = router;
