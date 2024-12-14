const  Role  = require('../../models/role.model');

const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required.' });
    }

    const role = await Role.create({ name });

    return res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: 'No roles found' });
    }
    return res.status(200).json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {createRole, getRoles}