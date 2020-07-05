const express = require('express');
const app = express();
const router = express.Router();
const sharp = require('sharp');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const getToken = require('../middleware/session');
const sessionInit = require('../middleware/session.js');
const { upload, uploadPic } = require('../controller/uploadProfile');

// app.get('/:username/chat');


router.post('/:username', upload.single('profilepicture'), async (req, res) => {
  await uploadPic(req, res);
});
router.get('/:username', getToken, async (req, res, next) => {
  const infoaz = req.headers.authorization;
  console.log(req.token);
  const err = jwt.verify(req.token, 'secret-key');
  res.set('Content-Type', 'image/png');
  let username = `${req.params.username}--profilepicture.png`;
  fs.access(path.join(__dirname, `../public/images/${username}`), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, `../public/images/defaultprofile.png`));
    } else {
      res.sendFile(path.join(__dirname, `../public/images/${username}`));
    }
  });
});


module.exports = router;
