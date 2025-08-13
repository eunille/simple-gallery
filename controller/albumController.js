const albumService = require("../services/albumService");
const { asyncHandler } = require("../middleware/errorMiddleware");
const logger = require("../utils/logger");

// Get all albums for authenticated user
const getUserAlbums = asyncHandler(async (req, res) => {
  const albums = await albumService.getUserAlbums(req.user.id);

  res.status(200).json({
    message: "Albums retrieved successfully",
    data: albums,
  });
});

// Get album by ID
const getAlbumById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await albumService.getAlbumById(id, req.user.id);

  res.status(200).json({
    message: "Album retrieved successfully",
    data: album,
  });
});

// Create a new album
const createAlbum = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validate required fields
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      error: "Album name is required",
    });
  }

  const album = await albumService.createAlbum(
    { name: name.trim() },
    req.user.id
  );

  res.status(201).json({
    message: "Album created successfully",
    data: album,
  });
});

// Update album
const updateAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate required fields
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      error: "Album name is required",
    });
  }

  const album = await albumService.updateAlbum(
    id,
    { name: name.trim() },
    req.user.id
  );

  res.status(200).json({
    message: "Album updated successfully",
    data: album,
  });
});

// Delete album
const deleteAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await albumService.deleteAlbum(id, req.user.id);

  res.status(200).json({
    message: "Album deleted successfully",
    data: result,
  });
});

// Get album statistics
const getAlbumStats = asyncHandler(async (req, res) => {
  const stats = await albumService.getAlbumStats(req.user.id);

  res.status(200).json({
    message: "Album statistics retrieved successfully",
    data: stats,
  });
});

module.exports = {
  getUserAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumStats,
};
