const express = require('express');
const roleController = require('../../controllers/admin/role.controller');

const router = express.Router();

router.post('/', roleController.createRole);
router.get('/', roleController.getRoles);
// , authorize(['view_roles'])

module.exports = router;
