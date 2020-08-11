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


router.post('/:username', upload.single('avatar'), async (req, res) => {
  await uploadPic(req, res);
});
router.get('/:username', getToken, async (req, res, next) => {
  const infoaz = req.headers.authorization;
  console.log(req.token);
  const err = jwt.verify(req.token, 'secret-key');
  let pathaz = path.resolve('../front-end');
  let username = `${req.params.username}--profilepicture.png`;
  let defaultUsername = 'default--profilepicture.png';
  let defaultPath = path.join(pathaz, `/public/images/${defaultUsername}`);
  let profilePath = path.join(pathaz, `/public/images/${username}`);
  fs.stat(profilePath, (err, stats) => {
    if (err) {
      console.log(err);
      res.status(404);
    } else {
      res.send(`/images/${username}`);
    }
  });
  res.set('Content-Type', 'image/png');
});


module.exports = router;
