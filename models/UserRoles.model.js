const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const User = require('./user.models.js');
const  Role = require('./role.model.js');

const UserRoles = sequelize.define('UserRoles', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id',
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id',
    }
  }
}, {
  timestamps: false,
  tableName: 'UserRoles',
});

// User.belongsToMany(Role, { through: UserRoles, foreignKey: 'userId' });
// Role.belongsToMany(User, { through: UserRoles, foreignKey: 'roleId' });

module.exports = UserRoles;