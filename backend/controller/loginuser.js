const bcrypt = require('bcrypt');
const saltRounds = 5;
const { getUser, getPassword } = require('../models/createUser');
const loginAuthenticate = async (userLogin, userPassword) => {
  let isAuthenticated;
  const validateUser = await getUser(userLogin);
  if (validateUser) {
    const checkPassword = await getPassword(userLogin);
    const match = await bcrypt.compare(userPassword, checkPassword);
    if (match) {
      isAuthenticated = true;
      console.log('passwords match');
    } else {
      isAuthenticated = false;
      console.log('passwords dont match');
    }
  } else {
    console.log('user not found');
  }
  return isAuthenticated;
};

module.exports = loginAuthenticate;
