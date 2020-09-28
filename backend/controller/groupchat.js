const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const { createGroup } = require('../models/createUser');

let makeGroup = async (obj) => {
  try {
    await createGroup(obj);
  } catch (err) {
    throw new Error('couldnt add group ');
  }
};



module.exports = {
  makeGroup,
};
