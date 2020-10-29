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

router.get('/:username', async (req, res, next) => {
  // const err = jwt.verify(req.token, 'secret-key');
  let pathaz = path.resolve(__dirname, '../../front-end/src/images');
  let username = `${req.params.username}--profilepicture.png`;
  let defaultUsername = 'default--profilepicture.png';
  let defaultPath = path.join(pathaz, `/src/images/${defaultUsername}`);
  let profilePath = path.join(pathaz, `/${username}`);
  // check if path exists. if it does, send the route to the path, otherwise send the route to the default profile picture;
  fs.access(profilePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ default: defaultUsername });
    } else {
      res.status(200).send({ profilePicture: username });
    }
  });
  res.set('Content-Type', 'image/png');
});


module.exports = router;
