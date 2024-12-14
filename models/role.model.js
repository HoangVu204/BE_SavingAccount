const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
  tableName: 'Roles',
});

module.exports = Role;
