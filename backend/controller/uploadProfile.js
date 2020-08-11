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
  let pathaz = path.resolve('../front-end');
  let check = path.join(pathaz, '/public/images');
  
  await fs.writeFile(path.join(pathaz, `/public/images/${username}`), buffer, (req, res, err) => {
    if (err) throw err;
  });
  res.set('Content-Type', 'image/png');
  res.send(buffer.toString('base64'));
};

module.exports = {
  uploadPic,
  upload,
};
