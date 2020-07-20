const { check, validationResult, match } = require('express-validator');
const { createUser, getUser } = require('../models/createUser');
let isAuthenticated = {
  authenticated: false,
  data: null,
}
let authenticate = async (req, res) => {
  let { username, password, confirm__password} = req.body;
  let myResults;
  check('username').isLength({ min: 5 }).withMessage('Username must be at Least 5 Characters').isLength({ max: 20 })
    .withMessage('max length is 20 characters')
    .matches(/^[\w]*$/g)
    .withMessage('invalid username. Must contain only numbers, letter and underscores')
    .run(req);
  check('password').isLength({ max: 20 }).withMessage('Max Length is 20').isLength({ min: 5})
    .withMessage('password must be a minimum 5 characters')
    .run(req);
  check('confirm__password').equals(password).withMessage('Password do not match').run(req);
  const userquery = await getUser(username);
  const error = validationResult(req);
  const obj = {
    value: username,
    msg: 'Username is taken',
    param: 'username',
    location: 'body',
  };
  console.log(userquery);
  if (userquery !== false) {
    error.errors.push(obj);
  }
  if (error.isEmpty()) {
    try {
      await createUser(username, password); 
      isAuthenticated.authenticated = true;
      isAuthenticated.username = username;
    } catch (e) {
      isAuthenticated.authenticated = false;
      console.log(e);
      isAuthenticated.data = e;
    }
  } else { 
    isAuthenticated.authenticated = false;
    isAuthenticated.data = error.array();
  }
  return isAuthenticated;
};

module.exports = authenticate;
