const express = require('express');
const app = express();
const router = express.Router();
let bodyParser = require('body-parser');
const {getMessages} = require('../models/createUser');

router.get('/:username/:friendname', async (req, res) => {
  let { username, friendname } = req.params;
  let data = {
    username,
    friendname,
  };
  getMessages(data)
    .then((msg) => {
      res.status(200).send(msg);
    }).catch((err) => {
      console.log(err);
    });
});


module.exports = router;
