const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Transaction = require('./transaction.model');


const TransactionDetail = sequelize.define('TransactionDetail', {
  DetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TransactionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Transaction',
      key: 'TransactionID',
    },
    onDelete: 'CASCADE',
  },
  TransactionType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'TransactionDetail',
  timestamps: false,
});

Transaction.hasMany(TransactionDetail, { foreignKey: 'TransactionID' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'TransactionID' });

module.exports = TransactionDetail;
