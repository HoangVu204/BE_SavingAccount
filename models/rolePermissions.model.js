const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Role = require('./role.model');
const Permission = require('./permission.model');

const RolePermissions = sequelize.define('RolePermissions', {
  
    RoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id',   
        },
        onDelete: 'CASCADE',
        primaryKey: true, 
    },
    PermissionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'PermissionID',
        },
        onDelete: 'CASCADE', 
        primaryKey: true, 
    },
}, {
    tableName: 'RolePermissions', 
    timestamps: false,
});

RolePermissions.belongsTo(Role, { foreignKey: 'RoleID' });
RolePermissions.belongsTo(Permission, { foreignKey: 'PermissionID' });


module.exports = RolePermissions;

// Role.belongsToMany(Permission, { through: RolePermissions, foreignKey: 'RoleID' });
// Permission.belongsToMany(Role, { through: RolePermissions, foreignKey: 'PermissionID' });
