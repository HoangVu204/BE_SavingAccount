const express = require('express');
const roleController = require('../../controllers/admin/role.controller');
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const router = express.Router();

router.post('/create',authMiddlewares.authenticate, authMiddlewares.authorize(['create_role']), roleController.createRole);
router.get('/',authMiddlewares.authenticate, authMiddlewares.authorize(['view_role']), roleController.getRoles);
router.delete('/:ids',authMiddlewares.authorize(['delete_role']), roleController.deleteRoles);

module.exports = router;
