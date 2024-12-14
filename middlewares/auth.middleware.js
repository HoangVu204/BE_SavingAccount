const { verifyToken } = require('../config/jwtConfig');
const { sequelize } = require('../config/dbConfig');
// const { User, Role, Permission } = require('../models');
const jwt = require('jsonwebtoken');

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

// const isAdmin = async (req, res, next) => {
//   try {
//     const userRole = req.user.RoleID;

//     const role = await Role.findByPk(userRole);
//     if (!role || role.name !== 'Admin') {
//       return res.status(403).json({ message: 'Permission denied. Only Admins can perform this action.' });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

module.exports = {authenticate};
