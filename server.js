const express = require("express");
const cors = require("cors");
const { testConnection } = require("./models");
const env = require("./config/env");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use("/public", express.static("public"));

// Test database connection
testConnection();

// API routes
app.use("/api", require("./routes"));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Gallery API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
    documentation: "/api",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler (must be after all routes)
app.use("*", notFoundHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
