const User = require('../../models/user.models.js');
const  Role = require('../../models/role.model.js');
const UserRoles = require('../../models/UserRoles.model.js')
const PasswordReset = require('../../models/passWordReset.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateOtp } = require('../../services/otp.service.js');
const { sendMail } = require('../../config/mailConfig.js');
const { generateToken } = require('../../config/jwtConfig.js');
const path = require('path');
const fs = require('fs'); 

//[POST] /register
const registerUser = async (req, res) => {

  const { name, email, password, dateOfBirth, phoneNumber, province, city, address, country } = req.body;
  
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await Role.findOne({ where: { name: 'user' } });
    
    if (!userRole) {
      userRole = await Role.create({ name: 'user' });
    }
   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      phoneNumber,
      province,
      city,
      address,
      country,
      avatar: null,
    });

    await UserRoles.create({
      userId: user.id,
      roleId: userRole.id
    });

    const token = generateToken({ id: user.id, email: user.email, roles: userRole.id });

    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

//[POST] /login
const loginUser = async (req, res) => {
  const { email, password } = req.body; 
  console.log(req.body)

  try {
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {

      const roles = await user.getRoles();
      const roleids = roles.map(role => role.id);
      const token = generateToken({ id: user.id, email: user.email , roles: roleids });

      res.status(200).json({ message: 'Login successful', token });

    } else {
      res.status(401).json({ message: 'Incorrect email or password'  });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' , error });
  }
};

//[POST] /forgot-password
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const otp = generateOtp();
    const expiration = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.create({ email, otp, expiration });

    await sendMail(email, 'Password Reset - OTP', `Your one-time password (OTP) is: ${otp}. It will expire on ${expiration.toLocaleString()}.`);

    res.status(200).json({ message: `OTP has been sent to your email: ${email}` });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' , error });
  }
};

//[POST] /reset-password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const passwordReset = await PasswordReset.findOne({ where: { email, otp } });
    if (!passwordReset || new Date() > new Date(passwordReset.expiration)) {
      return res.status(400).json({ message: 'The OTP is invalid or has expired.'  });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });
    await PasswordReset.destroy({ where: { email, otp } });

    res.status(200).json({ message: 'Password has been successfully reset.'  });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while resetting the password.', error });
  }
};

//[GET] /profile
const profile = async (req, res) => {
  // res.status(200).json({ message: 'You are authenticated!', user: req.user });
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


//[PATCH] /profile/edit
const editProfile = async (req, res) => {
  const { name, email, password, dateOfBirth, phoneNumber, province, city, address, country } = req.body;
  const avatar = req.file ? req.file.path : null;

  if (!name && !email && !password && !dateOfBirth && !phoneNumber && !province && !city && !address && !country && !avatar) {
    return res.status(400).json({ message: 'Please provide at least one field to update' });
  }

  try {
    const userId = req.user.id; 
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    let hashedPassword = user.password;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      phoneNumber: phoneNumber || user.phoneNumber,
      province: province || user.province,
      city: city || user.city,
      address: address || user.address,
      country: country || user.country,
      avatar: avatar || user.avatar,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};

module.exports = { editProfile };



  




module.exports = { registerUser, loginUser, sendOtp, resetPassword, profile, editProfile};