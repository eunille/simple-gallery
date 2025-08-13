const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";

let config;
const configPath = path.resolve(__dirname, "config.json");
if (fs.existsSync(configPath)) {
  config = require(configPath)[env];
} else {
  throw new Error("config/config.json not found");
}

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

module.exports = sequelize;
