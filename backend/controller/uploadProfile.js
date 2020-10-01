const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|x-png)$/)) {
      cb(new Error('please upload a pdf'));
    }
    cb(undefined, true);
  },
});

const uploadPic = async (req, res, group = false) => {
  if (!group) {
    let username = `${req.params.username}--profilepicture.png`;
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer();
    let check = path.resolve(path.join(__dirname, '../../front-end/public/images'));
    await fs.writeFile(path.join(check, `/${username}`), buffer, (req, res, err) => {
      if (err) {
        res.status(422).send({ errorMsg: 'couldnt uplod picture' });
      }
    });
  } else {
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer();
    let groupId = `${req.params.groupId}--profilepicture.png`;
    let check = path.resolve(path.join(__dirname, '../../front-end/public/images'));
    await fs.writeFile(path.join(check, `/${groupId}`), buffer, (req, res, err) => {
      if (err) {
        res.status(422).send({ errorMsg: 'couldnt uplod picture' });
      }
    });
  }
};

module.exports = {
  uploadPic,
  upload,
};
