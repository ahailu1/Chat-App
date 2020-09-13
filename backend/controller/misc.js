let bcrypt = require('bcrypt');
let { declineRequest, getDeclined,loginLock } = require('../models/createUser');
const declineReq = (username, friendname) => {

  return declineRequest(username, friendname).then((res) => {
    console.log('friend request declined for' + friendname);
    return true;
  }).catch((err) => {
    throw new Error('something happened');
  });
};
const fetchDeclined = async (username) => {
  try {
    let response = await getDeclined(username);
    console.log(response);
    return response;
  } catch (err) {
    return false;
  }
};
const userUnlock = async (req, res) => {
  let { username,friendname, password, query } = req.body;
  console.log([username,friendname,password,query]);
  try {
    let response = await loginLock(username, friendname, query);
    console.log(response);
    console.log('adsdsadsa');
    let match = await bcrypt.compare(password, response);
    if (match) {
      res.status(200).send({ message: 'password confirmed' });
    } else {
      res.status(422).send({message: 'password do not match'});
    }
  } catch (err) {
    res.status(422).send({ error: 'there was an error in setting  your password'});
  }
};

module.exports = {
  declineReq,
  fetchDeclined,
  userUnlock,
};
