const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const { removePending, pendingRequests, addFriend, getFriendRequests, confirmFriend, getMyFriends } = require('../controller/addFriend');
const getToken = require('../middleware/session');
const sessionInit = require('../middleware/session.js');


router.get('/notifications/:username', async (req, res) => {
  console.log(req.params.username);
  const notifications = await getFriendRequests(req, res);
  res.status(200).send(notifications);
});

router.get('/addfriend/:username/:friendname', async (req, res) => {
  console.log(req.params.username);
  const requests = await addFriend(req, res);
  res.status(200).send('success');
});

router.get('/confirm/:username/:friendname', async (req, res) => {
  const confirm = await confirmFriend(req, res);
  res.status(200).send('success');
});
router.get('/getfriends/:username', async (req, res) => {
  console.log(req.params.username);
  const results = await getMyFriends(req, res);
  res.status(200).send(results);
});
router.get('/pending/:username', async (req, res) => {
  console.log(req.params.username);
  const results = await pendingRequests(req, res);
  res.status(200).send(results);
});
router.get('/deletepending/:username/:friendname', async (req, res) => {
  const results = await removePending(req, res);
  res.status(200).send('success');
});

module.exports = router;
