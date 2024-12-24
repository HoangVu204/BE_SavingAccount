const express = require('express');
const userRoleController = require('../../controllers/admin/userRole.controller');
const authMiddlewares = require("../../middlewares/auth.middleware.js")

const router = express.Router();

router.post('/', userRoleController.assignUserToRole);
router.get('/', userRoleController.getUserRole);

module.exports = router;
