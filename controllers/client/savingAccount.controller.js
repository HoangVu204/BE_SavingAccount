const SavingType = require('../../models/savingType.model')
const SavingAccount = require('../../models/savingAccount.model')

//[POST] /create

const createSavingAccount = async (req, res) => {
  try {
    const { UserID, SavingTypeID, InitialDeposit } = req.body;

    const savingType = await SavingType.findByPk(SavingTypeID);
    if (!savingType) {
      return res.status(404).json({ error: 'Saving type does not exist!' });
    }

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

module.exports = {createSavingAccount}