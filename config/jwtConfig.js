const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

const generateToken = (user) => {
  const roles = user.roles && Array.isArray(user.roles) 
    ? user.roles.map(role => role.name) 
    : [];

  const payload = { 
    id: user.id, 
    email: user.email, 
    roles: roles 
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
