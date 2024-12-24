const express = require('express');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const SavingAccount = require('../../controllers/client/savingAccount.controller.js');

// router.post('/create', authMiddlewares .authenticate, SavingAccount.createSavingAccount); 
// router.get('/:userId', authMiddlewares .authenticate, SavingAccount.getAccount )
router.post('/create', SavingAccount.createSavingAccount); 
router.get('/:userId', SavingAccount.getSavingAccount )


module.exports = router;