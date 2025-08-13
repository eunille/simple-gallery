require("dotenv").config();
const fs = require("fs");
const path = require("path");

const env = process.env.NODE_ENV || "development";
let dbConfig;
const configPath = path.resolve(__dirname, "config.json");
if (fs.existsSync(configPath)) {
  dbConfig = require(configPath)[env];
} else {
  throw new Error("config/config.json not found");
}

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: env,
  JWT_EXPIRES_IN: "7d",
  DB: dbConfig,
};
