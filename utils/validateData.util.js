const validateDataRegister = (data) => {
  const { name, email, password, dateOfBirth, phoneNumber, province, city, address, country } = data;

  if (!name || !email || !password || !dateOfBirth || !phoneNumber || !province || !city || !address || !country) {
    return 'Please provide all required information';
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
};

module.exports = {validateDataRegister}
