const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router();
const path = require('path');
const authenticate = require('../controller/createuser');
const loginAuthenticate = require('../controller/loginuser');
const {getAll} = require('../models/createUser');
const getToken = require('../middleware/session');
router.post('/createaccount', async (req, res, next) => {
  let isValidated = await authenticate(req, res);
  if (isValidated.authenticated === true) {
    const { username } = isValidated;
    const token = await jwt.sign({ user: username }, 'secret-key');
    res.status(200).send({ username,
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
  if (test.validated) {
    const token = await jwt.sign({ user: username }, 'secret-key');
    res.status(200).json({
      authenticated: true,
      token,
      username,
    }); 
  } else {
    res.status(422).send({ error: test });
  }
});
router.get('/authenticate', getToken, async (req, res, next) => {
  jwt.verify(req.token, 'secret-key', (err, authorized) => {
    if (err) {
      res.status(403);
    } else {
      res.status(200).send('authenticated');
    }
  });
});
router.get('/allusers', async (req, res) => {
  try {
    let list = await getAll();
    res.status(200).send(list);
  } catch (err) {
    res.status(422);
  }
});

module.exports = router;
