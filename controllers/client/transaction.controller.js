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

    // Only allow deposits for non-term savings accounts with a minimum amount of 100,000
    if (savingAccount.SavingType.TypeName !== 'non-term') {
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

    if (!AccountID || Amount === undefined || Amount <= 0) {
      return res.status(400).json({
        error: 'Invalid input! AccountID and Amount must be provided and Amount must be greater than 0.',
      });
    }

    const savingAccount = await SavingAccount.findByPk(AccountID, {
      include: [SavingType],
    });

    if (!savingAccount) {
      return res.status(404).json({ error: 'Saving account not found!' });
    }

    const { OpeningDate, Balance, Status } = savingAccount;
    const { TypeName, DurationInDays, InterestRate } = savingAccount.SavingType;

    if (Status !== 'active') {
      return res.status(400).json({ error: 'This account is no longer active!' });
    }

    const currentDate = new Date();
    const daysSinceOpening = Math.floor((currentDate - new Date(OpeningDate)) / (1000 * 60 * 60 * 24));

    if (TypeName !== 'non-term') {
      if (daysSinceOpening < DurationInDays) {
        return res.status(400).json({
          error: 'Cannot withdraw from term savings before the term ends!',
        });
      }

      if (Amount !== Balance) {
        return res.status(400).json({
          error: 'For term savings, you must withdraw the full balance!',
        });
      }

      const termsCompleted = Math.floor(daysSinceOpening / DurationInDays);
      const interest = termsCompleted * InterestRate * Balance;

      await savingAccount.update({ Balance: 0, Status: 'closed' });

      const transaction = await Transaction.create({
        AccountID,
        TransactionType: 'Withdraw',
        TransactionDate: currentDate,
        Amount: Balance + interest,
      });

      // Thêm chi tiết giao dịch
      await TransactionDetail.create({
        TransactionID: transaction.TransactionID,
        Description: `Withdrawal of ${Balance + interest} (including interest ${interest}) from account ${AccountID}`,
      });

      return res.status(200).json({
        message: 'Withdrawal successful!',
        interestEarned: interest,
        totalPayout: Balance + interest,
      });
    }

    if (TypeName === 'non-term') {
      if (Amount > Balance) {
        return res.status(400).json({
          error: 'Insufficient balance for the withdrawal!',
        });
      }

      let interest = 0;
      if (daysSinceOpening >= 30) {
        interest = 0.0015 * Balance;
      }

      const newBalance = Balance - Amount;

      await savingAccount.update({ Balance: newBalance, Status: newBalance === 0 ? 'closed' : 'active' });

      const transaction = await Transaction.create({
        AccountID,
        TransactionType: 'Withdraw',
        TransactionDate: currentDate,
        Amount,
      });

      // Thêm chi tiết giao dịch
      await TransactionDetail.create({
        TransactionID: transaction.TransactionID,
        Description: `Withdrawal of ${Amount} from account ${AccountID}. Interest earned: ${interest}`,
      });

      return res.status(200).json({
        message: 'Withdrawal successful!',
        interestEarned: interest,
        remainingBalance: newBalance,
        totalPayout: Amount + interest,
      });
    }

    return res.status(400).json({ error: 'Invalid saving account type!' });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    return res.status(500).json({
      error: 'An error occurred while processing the withdrawal.',
    });
  }
};

module.exports = { depositMoney, withdrawMoney };
