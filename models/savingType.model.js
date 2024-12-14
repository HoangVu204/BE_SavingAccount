const {Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConfig');

const SavingType = sequelize.define('SavingType', {
  SavingTypeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TypeName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  DurationInDays: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  InterestRate: {
    type: DataTypes.DECIMAL(5, 3), 
    allowNull: false,
  },
  MinDeposit: {
    type: DataTypes.DECIMAL(18, 2), 
    allowNull: false,
  },
}, {
  tableName: 'SavingType', 
  timestamps: false,
})

module.exports = SavingType;
