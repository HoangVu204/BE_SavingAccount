const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  expiration: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = PasswordReset;
