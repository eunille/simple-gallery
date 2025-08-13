const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

// Import models
const User = require('./User')(sequelize);
const Album = require('./Album')(sequelize);
const Image = require('./Image')(sequelize);

// Set up associations
const models = {
  User,
  Album,
  Image,
};

// Call associate function for each model after all models are loaded
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
}

module.exports = {
  sequelize,
  Sequelize,
  ...models,
  testConnection,
};
