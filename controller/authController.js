const authService = require("../services/authService");
const { asyncHandler } = require("../middleware/errorMiddleware");
const logger = require("../utils/logger");

// Register a new user
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "Username, email, and password are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  const result = await authService.register({ username, email, password });

  res.status(201).json({
    message: "User registered successfully",
    data: result,
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "Email and password are required",
    });
  }

  const result = await authService.login({ email, password });

  res.status(200).json({
    message: "Login successful",
    data: result,
  });
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    message: "Profile retrieved successfully",
    data: user,
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
