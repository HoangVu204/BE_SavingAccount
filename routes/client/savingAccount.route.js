const express = require('express');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const SavingAccount = require('../../controllers/client/savingAccount.controller.js');

router.post('/create', SavingAccount.createSavingAccount); 



module.exports = router;