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
  console.log([username, friendname,password,query]);
  try {
    let response = await loginLock(username, friendname, query);
    console.log(response);
    let checkPass = Object.values(response[0])[0];
    let match = await bcrypt.compare(password, checkPass);
    console.log(match);
    let returnVal = match ? true : false;
    return returnVal;
  } catch (err) {
    throw new Error('couldnt fetch pass');
  }
};


module.exports = {
  declineReq,
  fetchDeclined,
  userUnlock,
};
