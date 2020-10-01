let bcrypt = require('bcrypt');
let { declineRequest, getDeclined, loginLock } = require('../models/createUser');
const declineReq = (username, friendname) => {

  return declineRequest(username, friendname).then((res) => {
    return true;
  }).catch((err) => {
    throw new Error('something happened');
  });
};
const fetchDeclined = async (username) => {
  try {
    let response = await getDeclined(username);
    return response;
  } catch (err) {
    return false;
  }
};
const userUnlock = async (req, res) => {
  let { username,friendname, password, query } = req.body;
  try {
    let response = await loginLock(username, friendname, query);
    let checkPass = Object.values(response[0])[0];
    let match = await bcrypt.compare(password, checkPass);
    let returnVal = match ? true : false;
    return returnVal;
  } catch (err) {
    res.status(422).send({ error: 'there was an error in setting  your password'});
  }
};

module.exports = {
  declineReq,
  fetchDeclined,
  userUnlock,
};
