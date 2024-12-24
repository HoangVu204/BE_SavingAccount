const SavingType = require('../../models/savingType.model');

// Create a new saving type
const createSavingType = async (req, res) => {
  try {
    const { TypeName, DurationInDays, InterestRate, MinDeposit } = req.body;

    if (!TypeName || InterestRate === undefined || MinDeposit === undefined) {
      return res.status(400).json({ message: 'TypeName, InterestRate, and MinDeposit are required.' });
    }
    const newSavingType = await SavingType.create({ 
      TypeName, 
      DurationInDays, 
      InterestRate, 
      MinDeposit 
    });

    res.status(201).json(newSavingType);
  } catch (error) {
    res.status(500).json({ message: 'Error creating saving type', error: error.message });
  }
};


const getSavingTypes = async (req, res) => {
  try {
    const savingTypes = await SavingType.findAll();

    res.status(200).json(savingTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saving types', error: error.message });
  }
};

const updateSavingType = async (req, res) => {
  try {
    const { id } = req.params;
    const { TypeName, DurationInDays, InterestRate, MinDeposit } = req.body;

    const savingType = await SavingType.findByPk(id);

    if (!savingType) {
      return res.status(404).json({ message: 'Saving type not found' });
    }

    savingType.TypeName = TypeName !== undefined ? TypeName : savingType.TypeName;
    savingType.DurationInDays = DurationInDays !== undefined ? DurationInDays : savingType.DurationInDays;
    savingType.InterestRate = InterestRate !== undefined ? InterestRate : savingType.InterestRate;
    savingType.MinDeposit = MinDeposit !== undefined ? MinDeposit : savingType.MinDeposit;

    await savingType.save();

    res.status(200).json({ message: 'Saving type updated successfully', savingType });
  } catch (error) {
    res.status(500).json({ message: 'Error updating saving type', error: error.message });
  }
};


const deleteSavingType = async (req, res) => {
  try {
    const { id } = req.params;

    const savingType = await SavingType.findByPk(id);

    if (!savingType) {
      return res.status(404).json({ message: 'Saving type not found' });
    }

    await savingType.destroy();

    res.status(200).json({ message: 'Saving type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting saving type', error: error.message });
  }
};

module.exports = { createSavingType, getSavingTypes, updateSavingType, deleteSavingType };
