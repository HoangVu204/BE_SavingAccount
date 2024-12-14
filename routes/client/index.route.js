const express = require('express');

const userRoutes = require('./user.route');
const SavingAccount = require('./savingAccount.route')

const router = express.Router();

router.use('/', userRoutes);
router.use('/saving-account', SavingAccount);

module.exports = router;
