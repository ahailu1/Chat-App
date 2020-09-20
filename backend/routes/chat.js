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
  console.log('right here tryna post a pic');
  await uploadPic(req, res);
});

router.get('/:username', getToken, async (req, res, next) => {
  const err = jwt.verify(req.token, 'secret-key');
  let pathaz = path.resolve(__dirname, '../public/images');
  let username = `${req.params.username}--profilepicture.png`;
  let defaultUsername = 'default--profilepicture.png';
  let defaultPath = path.join(pathaz, `/public/images/${defaultUsername}`);
  let profilePath = path.join(pathaz, `/${username}`);
  // check if path exists. if it does, send the route to the path, otherwise send the route to the default profile picture;
  fs.stat(profilePath, (err, stats) => {
    if (err) {
      console.log(err);
      res.status(404);
    } else {
      res.send(`${defaultPath}`);
    }
  });
  res.set('Content-Type', 'image/png');
});


module.exports = router;
