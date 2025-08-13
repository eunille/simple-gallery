const express = require("express");
const router = express.Router();
const imageController = require("../controller/imageController");
const { authenticateToken } = require("../middleware/authMiddleware");

// All image routes require authentication
router.use(authenticateToken);

// Get all images in an album
router.get("/album/:albumId", imageController.getAlbumImages);

// Upload single image to album
router.post("/album/:albumId", imageController.uploadImage);

// Upload multiple images to album
router.post("/album/:albumId/multiple", imageController.uploadMultipleImages);

// Get image by ID
router.get("/:id", imageController.getImageById);

// Update image
router.put("/:id", imageController.updateImage);

// Delete image
router.delete("/:id", imageController.deleteImage);

// Get image statistics
router.get("/stats", imageController.getImageStats);

module.exports = router;
