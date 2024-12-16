const validateData = require('../utils/validateData.util.js')

const validateDataRegister = (req, res, next) => {
  const errorMessage = validateData.validateDataRegister(req.body);

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  next();
};

const validateDataEditProifile = (req, res, next) => {
  const errorMessage = validateData.validateDataEditProfile(req.body);

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  next();
};

module.exports = {validateDataRegister,validateDataEditProifile}