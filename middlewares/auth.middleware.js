const { verifyToken } = require('../config/jwtConfig');
const { sequelize } = require('../config/dbConfig');
const User = require('../models/user.models');
const Role = require('../models/role.model');
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
const authorize = () => {
  return (req, res, next) => {
    try {
      const Roles = req.user?.roles;

      if (!Roles) {
        return res.status(403).json({ message: 'No roles found in user data.' });
      }

       //------------------------------Permission--------------------------------------
      // Kiểm tra xem các role của user có phù hợp với quyền yêu cầu không
      //-------------------------------------------------------------------------------

      // Nếu bạn muốn kiểm tra tất cả các role của user, thì chỉ cần so sánh với array `requiredRoles`
      const hasPermission = Roles.some(role => role === 'Admin'); // Ví dụ: kiểm tra xem user có vai trò Admin không

      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      next();
    } catch (error) {
      console.error(error); // Ghi lỗi để debug
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

module.exports = { authenticate, authorize };
