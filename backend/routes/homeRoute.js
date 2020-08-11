const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router();
const path = require('path');
const authenticate = require('../controller/createuser');
const loginAuthenticate = require('../controller/loginuser');
router.post('/api', async (req, res, next) => {
  console.log(path.join('/', '..'));
  if (req.body.login__user) {
    next('route');
  } else {
    let isValidated = await authenticate(req, res);
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
  }
});
router.post('/api', async (req, res, next) => {
  const { username__login: username, password__login: password } = req.body;
  const test = await loginAuthenticate(username, password);
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

module.exports = router;
