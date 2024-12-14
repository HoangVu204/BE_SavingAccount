const Transaction = require('../../models/transaction.model');
const TransactionDetail = require('../../models/transactionDetail.model');
const SavingAccount = require('../../models/savingAccount.model');
const SavingType = require('../../models/savingType.model');
const { Op } = require('sequelize');

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

    const account = await SavingAccount.findOne({
      where: { AccountID },
      include: SavingType, 
    });

    if (!account) {
      return res.status(404).json({ error: 'Saving account not found' });
    }

    const today = new Date();
    const openingDate = new Date(account.OpeningDate);
    const daysSinceOpening = Math.floor((today - openingDate) / (1000 * 60 * 60 * 24));

    const savingType = account.SavingType;
    const isFixedTerm = savingType.DurationInDays > 0; 

    if (daysSinceOpening < 15) {
      return res.status(400).json({ error: 'You can only withdraw after at least 15 days since opening the account.' });
    }

    if (isFixedTerm) {
      const termEndDate = new Date(openingDate);
      termEndDate.setDate(termEndDate.getDate() + savingType.DurationInDays);

      if (today < termEndDate) {
        return res.status(400).json({ error: 'You can only withdraw after the term has ended.' });
      }

      if (Amount !== account.Balance) {
        return res.status(400).json({ error: 'For fixed-term savings, you must withdraw the full balance.' });
      }

      const fullTermCount = Math.floor(daysSinceOpening / savingType.DurationInDays);
      const interestRate =
        savingType.DurationInDays === 90 ? 0.005 : 
        savingType.DurationInDays === 180 ? 0.0055 :
        0;

      const interest = fullTermCount * interestRate * savingType.DurationInDays * account.Balance;

      const totalWithdraw = account.Balance + interest;

      await processWithdrawal(AccountID, totalWithdraw, 'Withdrawal after fixed term', res, account);
    } else {
      if (Amount > account.Balance) {
        return res.status(400).json({ error: 'You cannot withdraw more than your current balance.' });
      }

      let interest = 0;
      if (daysSinceOpening >= 30) {
        interest = account.Balance * 0.0015; 
      }

      const remainingBalance = account.Balance - Amount;

      await processWithdrawal(AccountID, Amount, Description, res, account, interest, remainingBalance);
    }
  } catch (error) {
    console.error('Error during withdrawal:', error);
    return res.status(500).json({ error: 'An error occurred during the withdrawal process.' });
  }
};

module.exports = {depositMoney , withdrawMoney}