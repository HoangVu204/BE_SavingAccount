const express = require('express');
const userController = require('../../controllers/client/user.controller.js');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const validate = require('../../middlewares/validdateData.middleware.js')
const {upload } = require('../../config/cloundinaryConfig.js')
const loginUtil = require('../../utils/login.util.js')


router.post('/register', validate.validateDataRegister, userController.registerUser);

router.post('/login',loginUtil.loginLimiter ,userController.loginUser);    

router.post('/forgot-password', userController.sendOtp);
router.post('/reset-password', userController.resetPassword);

router.get('/profile',authMiddlewares.authenticate, userController.profile);

router.patch('/profile/edit', authMiddlewares.authenticate, validate.validateDataEditProifile, upload.single("avatar"), userController.editProfile);

module.exports = router;