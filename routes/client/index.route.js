const express = require('express');

const userRoutes = require('./user.route');
const savingAccountRoutes = require('./savingAccount.route')
const transactionRoutes = require('./transaction.route')
const reportRoutes = require('./report.route');

const router = express.Router();

router.use('/', userRoutes);
router.use('/saving-account', savingAccountRoutes);
router.use('/transaction', transactionRoutes);
router.use('/report', reportRoutes);


module.exports = router;
