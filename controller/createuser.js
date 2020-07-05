const { check, validationResult, match } = require('express-validator');
const { createUser, getUser } = require('../models/createUser');

let authenticate = async (req, res) => {
  let { username, password} = req.body;
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
  console.log(userquery);
  const error = validationResult(req);
  console.log(error);
  const obj = {
    value: username,
    msg: 'Username is taken',
    param: 'username',
    location: 'body',
  };
  if (userquery) {
    error.errors.push(obj);
  }
  if (error.isEmpty()) {
    await createUser(username, password);
    res.status(200).json({ message: 'user created' });
  } else {
    return res.status(422).json({ error: error.array() });
  }
};

module.exports = authenticate;
