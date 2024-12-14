const express = require('express');
const userRoleController = require('../../controllers/admin/userRole.controller');

const router = express.Router();

router.post('/', userRoleController.assignUserToRole);
router.get('/', userRoleController.getUserRole);
// , authorize(['view_roles'])

module.exports = router;
