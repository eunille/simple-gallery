const { verifyToken, extractTokenFromHeader } = require("../utils/jwt");
const { User } = require("../models");
const logger = require("../utils/logger");

// Authentication middleware
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error.message);
    return res.status(401).json({
      error: "Invalid token.",
    });
  }
}

// Optional authentication middleware (doesn't fail if no token)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(); // Continue without authentication
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    logger.warn("Optional authentication failed:", error.message);
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
};
