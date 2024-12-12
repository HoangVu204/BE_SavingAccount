const express = require('express');
const authController = require('../controllers/auth.controller.js');
const router = express.Router();
// const authenticate = require('../middlewares/authenticate.middleware.js');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);    
router.post('/forgot-password', authController.sendOtp);
router.post('/reset-password', authController.resetPassword);
// router.get('/profile', authenticate,  authController.profile)


module.exports = router;