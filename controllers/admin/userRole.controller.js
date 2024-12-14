const  Role  = require('../../models/role.model');
const User = require('../../models/user.models')
const UserRoles = require('../../models/UserRoles.model')

const assignUserToRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
        return res.status(404).json({ message: "User or Role not found" });
    }

    await UserRoles.create({ userId, roleId });

    return res.status(200).json({ message: "Role assigned to user successfully" });
  } catch (error) {
      console.error("Error assigning role to user:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getUserRole = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name'],
        }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const userRoles = users.map(user => ({
      userId: user.id,
      userName: user.name,
      roles: user.Roles.map(role => ({
        id: role.id,
        name: role.name
      }))
    }));

    return res.status(200).json({
      userRoles
    });
  } catch (error) {
    console.error('Error retrieving user roles:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




module.exports = {assignUserToRole, getUserRole }