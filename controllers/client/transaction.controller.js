const Transaction = require('../../models/transaction.model');
const TransactionDetail = require('../../models/transactionDetail.model');
const SavingAccount = require('../../models/savingAccount.model');

const depositMoney = async (req, res) => {
  try {
    const { AccountID, Amount, Description } = req.body;

    if (Amount <= 0) {
      return res.status(400).json({ error: 'Deposit amount must be greater than 0' });
    }

    const account = await SavingAccount.findByPk(AccountID);
    if (!account) {
      return res.status(404).json({ error: 'Saving account not found' });
    }

    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.create({
        AccountID,
        TransactionDate: new Date(),
      }, { transaction: t });

      await TransactionDetail.create({
        TransactionID: transaction.TransactionID,
        TransactionType: 'Deposit',
        Amount,
        Description,
      }, { transaction: t });

      account.Balance += parseFloat(Amount);
      await account.save({ transaction: t });
    });

    return res.status(201).json({ message: 'Deposit successful' });
  } catch (error) {
    console.error('Error during deposit:', error);
    return res.status(500).json({ error: 'An error occurred during the deposit process' });
  }
};

const withdrawMoney = async (req, res) => {
  try {
    const { AccountID, Amount, Description } = req.body;

    if (Amount <= 0) {
      return res.status(400).json({ error: 'Withdrawal amount must be greater than 0' });
    }

    const account = await SavingAccount.findByPk(AccountID);
    if (!account) {
      return res.status(404).json({ error: 'Saving account not found' });
    }

    if (account.Balance < Amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.create({
        AccountID,
        TransactionDate: new Date(),
      }, { transaction: t });

      await TransactionDetail.create({
        TransactionID: transaction.TransactionID,
        TransactionType: 'Withdrawal',
        Amount,
        Description,
      }, { transaction: t });

      account.Balance -= parseFloat(Amount);
      await account.save({ transaction: t });
    });

    return res.status(201).json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    return res.status(500).json({ error: 'An error occurred during the withdrawal process' });
  }
};
module.exports = {depositMoney , withdrawMoney}