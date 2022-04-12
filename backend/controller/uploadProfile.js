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
    let check = path.resolve(path.join(__dirname, '../public/images'));
    await fs.writeFile(`/srv/profile`, buffer, (err) => {
      if (err) {
        res.status(422).send({ errorMsg: 'couldnt uplod picture' });
      } else {
        res.status(200);
      }
    });
  } else {
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer();
    let groupId = `${req.params.groupId}--profilepicture.png`;
    let check = path.resolve(path.join(__dirname, '../public/images'));
    await fs.writeFile(`/srv/profile`, buffer, (req, res, err) => {
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
