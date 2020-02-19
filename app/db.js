const sequelize = require('sequelize');

const dbConnection = new sequelize.Sequelize(process.env.DATABASE_URL);

module.exports = dbConnection;