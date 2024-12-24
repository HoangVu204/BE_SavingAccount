const SavingType = require('../../models/savingType.model')
const SavingAccount = require('../../models/savingAccount.model')
// const { sequelize } = require('../../config/dbConfig');

//[POST] /api/saving-account/create
const createSavingAccount = async (req, res) => {
  try {
    const { UserID, SavingTypeID, InitialDeposit } = req.body;

    const savingType = await SavingType.findByPk(SavingTypeID);
    if (!savingType) {
      return res.status(404).json({ error: 'Saving type does not exist!' });
    }

    console.log(savingType.MinDeposit)
    if (InitialDeposit < savingType.MinDeposit) {
      return res.status(400).json({
        error: `The deposit amount must be greater than or equal to ${savingType.MinDeposit}!`,
      });
    }
    const newSavingAccount = await SavingAccount.create({
      UserID,
      SavingTypeID,
      OpeningDate: new Date(),
      Balance: InitialDeposit,
      Status: 'active',
      originalDurationInDays: savingType.DurationInDays, 
      originalInterestRate: savingType.InterestRate,
    });

    return res.status(201).json({
      message: 'Saving account created successfully!',
      savingAccount: newSavingAccount,
    });
  } catch (error) {
    console.error('Error creating saving account:', error);
    return res.status(500).json({ error: 'An error occurred while creating the saving account.' });
  }
};

// [GET] /api/saving-account/:userId?skip=0&limit=10
const getSavingAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skip = 0, limit = 10 } = req.query;

    const accounts = await SavingAccount.findAll({
      where: { UserID: userId },
      offset: parseInt(skip),
      limit: parseInt(limit),
      order: [['AccountID', 'ASC']],
    });
    console.log(accounts); // Log kết quả
    if (accounts.length === 0) {
      return res.status(404).json({ error: 'No saving accounts found for this user!' });
    }

    return res.status(200).json({
      message: 'Saving accounts found successfully!',
      accounts,
      pagination: {
        skip: parseInt(skip),
        limit: parseInt(limit),
      }
    });
  } catch (error) {
    console.error('Error fetching saving accounts:', error);
    return res.status(500).json({ error: 'An error occurred while fetching saving accounts.' });
  }
};

module.exports = {createSavingAccount, getSavingAccount}