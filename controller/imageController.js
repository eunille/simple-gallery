const imageService = require("../services/imageService");
const { uploadSingle, uploadMultiple } = require("../utils/multerConfig");
const { asyncHandler } = require("../middleware/errorMiddleware");
const logger = require("../utils/logger");

// Get all images in an album
const getAlbumImages = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const images = await imageService.getAlbumImages(albumId, req.user.id);

  res.status(200).json({
    message: "Images retrieved successfully",
    data: images,
  });
});

// Get image by ID
const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = await imageService.getImageById(id, req.user.id);

  res.status(200).json({
    message: "Image retrieved successfully",
    data: image,
  });
});

// Upload single image to album
const uploadImage = asyncHandler(async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: "File upload error",
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select an image file to upload",
      });
    }

    const { albumId } = req.params;
    const { title, description } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: "Image title is required",
      });
    }

    const imageData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      url: `/images/${req.file.filename}`,
    };

    const image = await imageService.uploadImage(
      imageData,
      albumId,
      req.user.id
    );

    res.status(201).json({
      message: "Image uploaded successfully",
      data: image,
    });
  });
});

// Upload multiple images to album
const uploadMultipleImages = asyncHandler(async (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: "File upload error",
        message: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No files uploaded",
        message: "Please select image files to upload",
      });
    }

    const { albumId } = req.params;
    const images = await imageService.uploadMultipleImages(
      req.files,
      albumId,
      req.user.id
    );

    res.status(201).json({
      message: "Images uploaded successfully",
      data: images,
    });
  });
});

// Update image
const updateImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // Validate required fields
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      error: "Image title is required",
    });
  }

  const updateData = {
    title: title.trim(),
    description: description ? description.trim() : null,
  };

  const image = await imageService.updateImage(id, updateData, req.user.id);

  res.status(200).json({
    message: "Image updated successfully",
    data: image,
  });
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await imageService.deleteImage(id, req.user.id);

  res.status(200).json({
    message: "Image deleted successfully",
    data: result,
  });
});

// Get image statistics
const getImageStats = asyncHandler(async (req, res) => {
  const stats = await imageService.getImageStats(req.user.id);

  res.status(200).json({
    message: "Image statistics retrieved successfully",
    data: stats,
  });
});

module.exports = {
  getAlbumImages,
  getImageById,
  uploadImage,
  uploadMultipleImages,
  updateImage,
  deleteImage,
  getImageStats,
};
