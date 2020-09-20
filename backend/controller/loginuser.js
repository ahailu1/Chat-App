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
      isAuthenticated = {validated: true};
      console.log('passwords match');
    } else {
      isAuthenticated = {validated: false, error: 'passwords dont match'};
      console.log('passwords dont match');
    }
  } else {
    isAuthenticated = { validated: false, error: 'username not found' }
  }
  return isAuthenticated;
};

module.exports = loginAuthenticate;
