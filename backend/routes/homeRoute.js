const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router();
const path = require('path');
const authenticate = require('../controller/createuser');
const loginAuthenticate = require('../controller/loginuser');
const getToken = require('../middleware/session');
router.post('/createaccount', async (req, res, next) => {
  let isValidated = await authenticate(req, res);
  console.log('right here');
  if (isValidated.authenticated === true) {
    const {username} = isValidated;
    console.log(isValidated);
    const token = await jwt.sign({ user: username }, 'secret-key');
    res.status(200).json({ username,
      token,
      authenticated: true,
    });
  } else {
    res.status(422).send({ isValidated });
  }
});
router.post('/loginuser', async (req, res, next) => {
  const { username__login: username, password__login: password } = req.body;
  const test = await loginAuthenticate(username, password);
  console.log('right here');
  if (test) {
    const token = await jwt.sign({ user: username }, 'secret-key');

    res.status(200).json({
      authenticated: true,
      token,
      username,
    });
  } else {
    res.status(422).json({ authenticated: false });
  }
});
router.get('/authenticate', getToken, async (req, res, next) => {
  console.log(req.token);
  jwt.verify(req.token, 'secret-key', (err, authorized) => {
    if (err) {
      res.status(403);
    } else {
      res.status(200).send('authenticated');
    }
  });
});

module.exports = router;
