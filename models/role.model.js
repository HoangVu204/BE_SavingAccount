const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
// const UserRoles = require('./UserRoles.model');
// const User = require('./user.models');

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

// Role.belongsToMany(User, { through: UserRoles, foreignKey: 'roleId' });

module.exports = Role;
