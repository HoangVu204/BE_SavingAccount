const validateData = require('../utils/validateData.util.js')

const validateDataRegisterMiddleware = (req, res, next) => {
  const errorMessage = validateData.validateDataRegister(req.body);

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  next();
};

module.exports = {validateDataRegisterMiddleware}