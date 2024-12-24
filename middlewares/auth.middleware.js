const { verifyToken } = require('../config/jwtConfig');
const { sequelize } = require('../config/dbConfig');
const User = require('../models/user.models');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermissions.model');
const jwt = require('jsonwebtoken');

// Middleware authenticate
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, please log in.' });
  }

  try {
    const decoded = verifyToken(token);
    
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware authorize
const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user; 
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const roles = user.roles;
      if (!roles || roles.length === 0) {
        return res.status(403).json({ message: 'No roles assigned to user' });
      }

      const permissions = await RolePermission.findAll({
        where: {
          RoleID: roles,
        },
        include: {
          model: Permission,
          attributes: ['PermissionName'],
        }
      });

      console.log(permissions)


      const userPermissions = permissions.map(permission => permission.Permission.PermissionName);

      const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

      if (!hasPermission) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};


module.exports = { authenticate, authorize };
