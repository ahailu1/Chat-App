const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
let { alterFavourites, friendStatus, createLock, deleteFriend } = require('../models/createUser');
const {
  removePending, addFriend, confirmFriend,
} = require('../controller/addFriend');
const { declineReq, userUnlock } = require('../controller/misc');
const getToken = require('../middleware/session');
const sessionInit = require('../middleware/session.js');


router.post('/setlock', async (req, res) => {
  let { username, password, query, friendname } = req.body;
  try {
    createLock(username, password, friendname, query);
    res.status(200).send('lock set');
  } catch (err) {
    res.status(422).send('hereaa');
  }
});
router.post('/unlock', async (req, res) => {
  try {
    let response = await userUnlock(req, res);
    if (response) {
      res.status(200).send({ message: 'password match' });
    } else {
      res.status(422).send({ message: 'error: enter password again' });
    }
  } catch (err) {
    res.status(422).send({ error: 'couldnt log in' });
  }
});
router.put('/removelock', async (req, res) => {
  let { username,password,friendname, query } = req.body;
  try {
    let response = await userUnlock(req, res);
    console.log(response + 'is the answer');
    if (response) {
      console.log('hereaz');
      console.log([username, query, friendname]);
      let item = await createLock(username, null, friendname, query, true);
      console.log(item);
      res.status(200).send({ message: 'password removed' });
    } else {
      res.status(422).send({ errorMsg: 'password is not correct' });
    }
  } catch (err) { 
    res.status(422).send({ errorMsg: 'something occurred. Try again' });
  }
});

router.get('/addfriend/:username/:friendname', async (req, res) => {
  const requests = await addFriend(req, res);
  res.status(200).send('success');
});

router.get('/confirm/:username/:friendname', async (req, res) => {
  const confirm = await confirmFriend(req, res);
  res.status(200).send('success');
});


router.get('/deletepending/:username/:friendname', async (req, res) => {
  const results = await removePending(req, res);
  res.status(200).send('success');
});
router.get('/declinerequest/:username/:friendname', (req, res) => {
  let { username, friendname} = req.params;
  declineReq(username, friendname)
    .then(() => { console.log('hello'); res.status(200).send(true); })
    .catch((err) => res.status(422));
});
router.get('/friendstatus/:username', async (req, res) => {
  let { username } = req.params;
  try { 
    let data = await friendStatus(username);
    res.status(200).send(data);
  } catch (err) {
    throw new Error('couldnt fetch data');
  }
});
router.get('/setfavourites/:username/:friendname/:value/:reverse', async (req, res) => {
  let { username, friendname, value, reverse } = req.params;
  try {
    alterFavourites(value, username, friendname, reverse);
  } catch (err) {
    res.status(422);
  }
});
router.delete('/deletefriend', async (req, res) => {
  let {username, friendname, query } = req.body;
  try {
    let deleteItem = await deleteFriend(username, friendname, query);
    console.log('deleting friend buddy')
    res.status(200).send({msg: 'friend deleted'});
  } catch (err) {
    res.status(422).send({errorMsg: 'couldnt delete friend'});
  };
});
module.exports = router;
