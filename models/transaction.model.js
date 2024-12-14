const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Transaction = sequelize.define('Transaction', {
  TransactionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  AccountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SavingAccount',
      key: 'AccountID',
    },
    onDelete: 'CASCADE',
  },
  TransactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'Transaction',
  timestamps: false,
});

module.exports = Transaction;
