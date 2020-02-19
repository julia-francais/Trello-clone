const sequelize = require('sequelize');

console.log(process.env.DATABASE_URL);

const dbConnection = new sequelize.Sequelize(process.env.DATABASE_URL);


module.exports = dbConnection;