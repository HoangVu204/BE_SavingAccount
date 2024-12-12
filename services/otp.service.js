const otpGenerator = require('otp-generator');
const generateOtp = () => otpGenerator.generate(6, {
  digits: true,
  upperCaseAlphabets: false,
  specialChars: false,
});

const isOtpValid = (otp, storedOtp) => otp === storedOtp;

module.exports = { generateOtp, isOtpValid };
