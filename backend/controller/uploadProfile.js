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

const uploadPic = async (req, res) => {
  let username = `${req.params.username}--profilepicture.png`;
  const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer();
  let pathaz = path.resolve(__dirname, '../public/images');
  let check = path.join(pathaz, '/public/images');
  console.log(path.join(pathaz, `/${username}`));
  await fs.writeFile(path.join(pathaz, `/${username}`), buffer, (req, res, err) => {
    if (err) console.log(err);
  });
  res.set('Content-Type', 'image/png');
  res.status(200).send(buffer.toString('base64'));
};

module.exports = {
  uploadPic,
  upload,
};
