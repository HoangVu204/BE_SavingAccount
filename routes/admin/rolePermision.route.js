const express = require('express');
const rolePermissionController = require('../../controllers/admin/rolePermission.controller');

const router = express.Router();

router.post('/', rolePermissionController.assignPermissionToRole);
router.get('/', rolePermissionController.getRolePermission);
// , authorize(['view_roles'])

module.exports = router;
