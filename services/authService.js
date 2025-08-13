const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger");

// Register a new user
async function register(userData) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    logger.info("User registered successfully:", {
      userId: user.id,
      email: user.email,
    });

    return {
      user: user.toJSON(),
      token,
    };
  } catch (error) {
    logger.error("Registration error:", error.message);
    throw error;
  }
}

// Login user
async function login(credentials) {
  try {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    logger.info("User logged in successfully:", {
      userId: user.id,
      email: user.email,
    });

    return {
      user: user.toJSON(),
      token,
    };
  } catch (error) {
    logger.error("Login error:", error.message);
    throw error;
  }
}

// Get user profile
async function getProfile(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  } catch (error) {
    logger.error("Get profile error:", error.message);
    throw error;
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
