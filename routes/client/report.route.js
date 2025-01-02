const express = require('express');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const reportController = require('../../controllers/client/report.controller.js')

router.get('/daily', reportController.dailyReport); 
router.get('/monthly', reportController.monthlyReport); 


module.exports = router;
