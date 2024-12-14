const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Permission = sequelize.define('Permission', {
    PermissionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PermissionName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'Permission',
    timestamps: false,
});


module.exports = Permission;
