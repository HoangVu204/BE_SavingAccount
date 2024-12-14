const express = require('express');
const permissionController = require('../../controllers/admin/permission.controller');
// const authorize = require('../../middleware/authorize');

const router = express.Router();

router.post('/', permissionController.createPermission);
router.get('/', permissionController.getPermissions);


module.exports = router;
