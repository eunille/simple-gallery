const env = require("../config/env");

// Simple logging utility
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(data && { data }),
  };

  if (env.NODE_ENV === "development") {
    console.log(
      `[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}`
    );
    if (data) {
      console.log("Data:", data);
    }
  } else {
    // In production, you might want to use a proper logging service
    console.log(JSON.stringify(logEntry));
  }
}

// Convenience methods
function info(message, data = null) {
  log("info", message, data);
}

function error(message, data = null) {
  log("error", message, data);
}

function warn(message, data = null) {
  log("warn", message, data);
}

function debug(message, data = null) {
  if (env.NODE_ENV === "development") {
    log("debug", message, data);
  }
}

module.exports = {
  log,
  info,
  error,
  warn,
  debug,
};
