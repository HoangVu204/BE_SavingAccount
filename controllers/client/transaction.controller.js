const Transaction = require('../../models/transaction.model');
const TransactionDetail = require('../../models/transactionDetail.model');
const SavingAccount = require('../../models/savingAccount.model');
const SavingType = require('../../models/savingType.model');

const depositMoney = async (req, res) => {
  try {
    const { AccountID, Amount } = req.body;

    const savingAccount = await SavingAccount.findByPk(AccountID, {
      include: [SavingType],
    });

    if (!savingAccount) {
      return res.status(404).json({ error: 'Saving account not found!' });
    }


    //QĐ2: Chỉ nhận gởi tiền với loại tiết kiệm không kỳ hạn. Số tiền gởi thêm tối thiểu là 100.000
    if (savingAccount.SavingType.TypeName !== 'Không kỳ hạn') {
      return res.status(400).json({
        error: 'Deposits are only allowed for non-term savings!',
      });
    }
    if (Amount < 100000) {
      return res.status(400).json({
        error: 'The deposit amount must be at least 100,000!',
      });
    }

    const newBalance = savingAccount.Balance + Amount;
    await savingAccount.update({ Balance: newBalance });

    const transaction = await Transaction.create({
      AccountID: savingAccount.AccountID,
      TransactionType: 'Deposit',
      TransactionDate: new Date(),
      Amount: Amount,
    });

    return res.status(200).json({
      message: 'Deposit successful!',
      transaction,
      newBalance,
    });
  } catch (error) {
    console.error('Error during deposit:', error);
    return res.status(500).json({
      error: 'An error occurred while processing the deposit.',
    });
  }
};


const withdrawMoney = async (req, res) => {
  try {
    const { AccountID, Amount } = req.body;

    const savingAccount = await SavingAccount.findByPk(AccountID, {
      include: [SavingType],
    });

    if (!savingAccount) {
      return res.status(404).json({ error: 'Saving account not found!' });
    }

    const daysSinceOpening = (new Date() - new Date(savingAccount.OpeningDate)) / (1000 * 3600 * 24);

    if (savingAccount.SavingType.TypeName === 'Có kỳ hạn') {

      if (daysSinceOpening < savingAccount.SavingType.DurationInDays) {
        return res.status(400).json({
          error: 'Withdrawal is only allowed after the term has ended and for the full amount!',
        });
      }

      const interestRate = savingAccount.SavingType.InterestRate;
      const durationInDays = savingAccount.SavingType.DurationInDays;

      let interest = (savingAccount.Balance * interestRate * (daysSinceOpening / durationInDays));

      const totalAmount = savingAccount.Balance + interest;

      if (Amount !== totalAmount) {
        return res.status(400).json({
          error: 'You must withdraw the full balance plus interest for term deposits!',
        });
      }
    } else if (savingAccount.SavingType.TypeName === 'Không kỳ hạn') {
      if (daysSinceOpening < 30) {
        return res.status(400).json({
          error: 'Deposit must be held for at least 1 month to earn interest!',
        });
      } 

      const interestRate = savingAccount.SavingType.InterestRate;

      const interest = (savingAccount.Balance * interestRate);

      if (Amount > savingAccount.Balance) {
        return res.status(400).json({
          error: 'Insufficient funds to withdraw!',
        });
      }

      const newBalance = savingAccount.Balance - Amount;
      await savingAccount.update({ Balance: newBalance });

      const transaction = await Transaction.create({
        AccountID: savingAccount.AccountID,
        TransactionType: 'Withdrawal',
        TransactionDate: new Date(),
        Amount: Amount,
      });

      if (newBalance === 0) {
        await savingAccount.update({ Status: 'closed' });
      }

      return res.status(200).json({
        message: 'Withdrawal successful!',
        transaction,
        newBalance,
        interest,
      });
    } else {
      return res.status(400).json({
        error: 'Invalid saving type for withdrawal!',
      });
    }
  } catch (error) {
    console.error('Error during withdrawal:', error);
    return res.status(500).json({
      error: 'An error occurred while processing the withdrawal.',
    });
  }
};

module.exports = { depositMoney, withdrawMoney };