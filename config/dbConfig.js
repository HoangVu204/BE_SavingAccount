const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
  logging: console.log
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database');
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
  }
};

module.exports = { sequelize, connectDB };
