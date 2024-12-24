const express = require('express');

const roleRoutes = require('./role.route');
const permissionRoutes = require('./permission.route');
const RolePermissions = require('./rolePermision.route');
const UserRoles = require('./userRole.route');
const savingTypeRoutes = require('./savingType.route')

const router = express.Router();

router.use('/roles', roleRoutes); 
router.use('/permissions', permissionRoutes);
router.use('/role-permissions', RolePermissions);
router.use('/user-roles', UserRoles);
router.use('/saving-type', savingTypeRoutes);

module.exports = router;
