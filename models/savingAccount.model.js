const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConfig');
const SavingType = require('./savingType.model');

const SavingAccount = sequelize.define('SavingAccount', {
  AccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  UserID: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
  },
  SavingTypeID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: SavingType, 
      key: 'SavingTypeID',
    },
  },
  OpeningDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Balance: {
    type: DataTypes.DECIMAL(18, 2), 
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Hoạt động', 
  },
}, {
  tableName: 'SavingAccount', 
  timestamps: false, 
});

SavingAccount.belongsTo(SavingType, { foreignKey: 'SavingTypeID' });

module.exports = SavingAccount;
