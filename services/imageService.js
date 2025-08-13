const { Image, Album, User } = require("../models");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

// Get all images in an album
async function getAlbumImages(albumId, userId) {
  try {
    const images = await Image.findAll({
      where: { albumId },
      include: [
        {
          model: Album,
          as: "album",
          where: { userId },
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return images;
  } catch (error) {
    logger.error("Get album images error:", error.message);
    throw error;
  }
}

// Get image by ID
async function getImageById(imageId, userId) {
  try {
    const image = await Image.findOne({
      where: { id: imageId },
      include: [
        {
          model: Album,
          as: "album",
          where: { userId },
          attributes: ["id", "name"],
        },
      ],
    });

    if (!image) {
      throw new Error("Image not found");
    }

    return image;
  } catch (error) {
    logger.error("Get image by ID error:", error.message);
    throw error;
  }
}

// Upload image to album
async function uploadImage(imageData, albumId, userId) {
  try {
    // Verify album belongs to user
    const album = await Album.findOne({
      where: { id: albumId, userId },
    });

    if (!album) {
      throw new Error("Album not found");
    }

    const image = await Image.create({
      ...imageData,
      albumId,
    });

    logger.info("Image uploaded successfully:", {
      imageId: image.id,
      albumId,
      userId,
      title: image.title,
    });

    return image;
  } catch (error) {
    logger.error("Upload image error:", error.message);
    throw error;
  }
}

// Update image
async function updateImage(imageId, updateData, userId) {
  try {
    const image = await Image.findOne({
      where: { id: imageId },
      include: [
        {
          model: Album,
          as: "album",
          where: { userId },
        },
      ],
    });

    if (!image) {
      throw new Error("Image not found");
    }

    await image.update(updateData);

    logger.info("Image updated successfully:", {
      imageId: image.id,
      userId,
      title: image.title,
    });

    return image;
  } catch (error) {
    logger.error("Update image error:", error.message);
    throw error;
  }
}

// Delete image
async function deleteImage(imageId, userId) {
  try {
    const image = await Image.findOne({
      where: { id: imageId },
      include: [
        {
          model: Album,
          as: "album",
          where: { userId },
        },
      ],
    });

    if (!image) {
      throw new Error("Image not found");
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), "public", image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.destroy();

    logger.info("Image deleted successfully:", {
      imageId: image.id,
      userId,
      title: image.title,
    });

    return { message: "Image deleted successfully" };
  } catch (error) {
    logger.error("Delete image error:", error.message);
    throw error;
  }
}

// Upload multiple images
async function uploadMultipleImages(files, albumId, userId) {
  try {
    // Verify album belongs to user
    const album = await Album.findOne({
      where: { id: albumId, userId },
    });

    if (!album) {
      throw new Error("Album not found");
    }

    const uploadedImages = [];

    for (const file of files) {
      const imageData = {
        title: file.originalname.split(".")[0], // Use filename as title
        url: `/images/${file.filename}`,
        description: null,
      };

      const image = await Image.create({
        ...imageData,
        albumId,
      });

      uploadedImages.push(image);
    }

    logger.info("Multiple images uploaded successfully:", {
      count: uploadedImages.length,
      albumId,
      userId,
    });

    return uploadedImages;
  } catch (error) {
    logger.error("Upload multiple images error:", error.message);
    throw error;
  }
}

// Get image statistics
async function getImageStats(userId) {
  try {
    const stats = await Image.findAll({
      attributes: [
        "albumId",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "imageCount",
        ],
      ],
      include: [
        {
          model: Album,
          as: "album",
          where: { userId },
          attributes: ["id", "name"],
        },
      ],
      group: ["albumId"],
    });

    return stats;
  } catch (error) {
    logger.error("Get image stats error:", error.message);
    throw error;
  }
}

module.exports = {
  getAlbumImages,
  getImageById,
  uploadImage,
  updateImage,
  deleteImage,
  uploadMultipleImages,
  getImageStats,
};
