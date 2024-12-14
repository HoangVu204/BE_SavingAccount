const Permission = require("../../models/permission.model");

const createPermission = async (req, res) => {
  try {
    const { PermissionName } = req.body;
    if (!PermissionName) {
      return res.status(400).json({ message: 'Permission name is required.' });
    }

    const existingPermission = await Permission.findOne({ where: { PermissionName } });
    if (existingPermission) {
      return res.status(409).json({ message: 'Permission already exists.' });
    }

    const permission = await Permission.create({ PermissionName });

    return res.status(201).json({ message: 'Permission created successfully', permission });
  } catch (error) {
    console.error('Error creating permission:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.stack });
  }
};

const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    
    if (!permissions || permissions.length === 0) {
      return res.status(200).json({ message: 'No permissions found', permissions: [] });
    }

    return res.status(200).json({ permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.stack });
  }
};

module.exports = { createPermission, getPermissions };
