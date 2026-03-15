const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name not Valid!!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Not a valid Email!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

module.exports = validateSignUpData;
