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

  if (phoneNumber) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return 'Invalid phone number format';
    }
  }

  if (name && name.trim() === '') {
    return 'Name cannot be empty';
  }

  if (province && province.trim() === '') {
    return 'Province cannot be empty';
  }

  if (city && city.trim() === '') {
    return 'City cannot be empty';
  }

  if (address && address.trim() === '') {
    return 'Address cannot be empty';
  }

  if (country && country.trim() === '') {
    return 'Country cannot be empty';
  }

  return null;
};

const validateDataEditProfile = (data) => {
  const { name, email, password, dateOfBirth, phoneNumber, province, city, address, country } = data;



  return null;
};

module.exports = {validateDataRegister, validateDataEditProfile}
