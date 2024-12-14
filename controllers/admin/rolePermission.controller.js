const RolePermission = require('../../models/rolePermissions.model')
const Permission = require("../../models/permission.model")
const  Role  = require('../../models/role.model');

const assignPermissionToRole = async (req, res) => {
  const { RoleID, PermissionIDs } = req.body;

  try {
      // Kiểm tra xem Role có tồn tại không
      const role = await Role.findByPk(RoleID);
      if (!role) {
          return res.status(404).json({ message: 'Role not found' });
      }

      // Lấy các Permission từ PermissionIDs (sử dụng PermissionID thay vì id)
      const permissions = await Permission.findAll({
          where: {
              PermissionID: PermissionIDs // Sử dụng PermissionID thay vì id
          }
      });

      // Kiểm tra xem tất cả các Permission có tồn tại không
      if (permissions.length !== PermissionIDs.length) {
          return res.status(404).json({ message: 'Some permissions not found' });
      }

      // Tạo mảng dữ liệu để insert vào RolePermissions
      const rolePermissions = PermissionIDs.map(permissionId => ({
          RoleID,
          PermissionID: permissionId
      }));

      // Chèn các bản ghi vào RolePermissions
       await RolePermission.bulkCreate(rolePermissions);

      return res.status(200).json({ message: 'Permissions assigned to role successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};



const getRolePermission = async (req, res) => {
  try {
    const rolePermissions = await RolePermission.findAll({
      include: [
        {
          model: Role,
          attributes: ['id'], 
        },
        {
          model: Permission,
          attributes: ['PermissionID'],
        },
      ],
    });

    console.log(rolePermissions)
    if (rolePermissions.length === 0) {
      return res.status(404).json({ message: 'No role permissions found.' });
    }

    const rolePermissionMap = {};

    rolePermissions.forEach((rp) => {
      const roleId = rp.RoleID;
      const permissionId = rp.PermissionID;

      if (!rolePermissionMap[roleId]) {
        rolePermissionMap[roleId] = [];
      }

      rolePermissionMap[roleId].push(permissionId);
    });

    const formattedRolePermissions = Object.keys(rolePermissionMap).map((roleId) => ({
      RoleID: roleId,
      PermissionIDs: rolePermissionMap[roleId], 
    }));

    return res.status(200).json({
      message: 'Role permissions retrieved successfully',
      rolePermissions: formattedRolePermissions,
    });
  } catch (error) {
    console.error('Error retrieving role permissions:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




module.exports = {assignPermissionToRole, getRolePermission  }