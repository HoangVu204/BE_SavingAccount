const express = require('express');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const transactionController = require('../../controllers/client/transaction.controller.js');

router.post('/deposit', transactionController.depositMoney);
router.post('/withdraw', transactionController.withdrawMoney);

module.exports = router;