const { Album, User, Image } = require("../models");
const logger = require("../utils/logger");

// Get all albums for a user
async function getUserAlbums(userId) {
  try {
    const albums = await Album.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: Image,
          as: "images",
          attributes: ["id", "title", "url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return albums;
  } catch (error) {
    logger.error("Get user albums error:", error.message);
    throw error;
  }
}

// Get album by ID with images
async function getAlbumById(albumId, userId) {
  try {
    const album = await Album.findOne({
      where: { id: albumId, userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: Image,
          as: "images",
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!album) {
      throw new Error("Album not found");
    }

    return album;
  } catch (error) {
    logger.error("Get album by ID error:", error.message);
    throw error;
  }
}

// Create a new album
async function createAlbum(albumData, userId) {
  try {
    const album = await Album.create({
      ...albumData,
      userId,
    });

    logger.info("Album created successfully:", {
      albumId: album.id,
      userId,
      name: album.name,
    });

    return album;
  } catch (error) {
    logger.error("Create album error:", error.message);
    throw error;
  }
}

// Update album
async function updateAlbum(albumId, updateData, userId) {
  try {
    const album = await Album.findOne({
      where: { id: albumId, userId },
    });

    if (!album) {
      throw new Error("Album not found");
    }

    await album.update(updateData);

    logger.info("Album updated successfully:", {
      albumId: album.id,
      userId,
      name: album.name,
    });

    return album;
  } catch (error) {
    logger.error("Update album error:", error.message);
    throw error;
  }
}

// Delete album
async function deleteAlbum(albumId, userId) {
  try {
    const album = await Album.findOne({
      where: { id: albumId, userId },
    });

    if (!album) {
      throw new Error("Album not found");
    }

    await album.destroy();

    logger.info("Album deleted successfully:", {
      albumId: album.id,
      userId,
      name: album.name,
    });

    return { message: "Album deleted successfully" };
  } catch (error) {
    logger.error("Delete album error:", error.message);
    throw error;
  }
}

// Get album statistics
async function getAlbumStats(userId) {
  try {
    const stats = await Album.findAll({
      where: { userId },
      attributes: [
        "id",
        "name",
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").col("images.id")
          ),
          "imageCount",
        ],
      ],
      include: [
        {
          model: Image,
          as: "images",
          attributes: [],
        },
      ],
      group: ["Album.id"],
      order: [["createdAt", "DESC"]],
    });

    return stats;
  } catch (error) {
    logger.error("Get album stats error:", error.message);
    throw error;
  }
}

module.exports = {
  getUserAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumStats,
};
