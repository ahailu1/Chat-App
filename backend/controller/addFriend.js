const { deletePending, addUser, confirmRequest, getMessages, addMessage } = require('../models/createUser');

const addFriend = async (req, res) => {
/* pending_first_second == 1
pending_second_first == 2
friends == 3
block_first_second == 4
block_second_first == 5
block_both == 6
*/
  const { username, friendname } = req.params;
  const response = await addUser(username, friendname);
};
const confirmFriend = async (req, res) => {
  const { username, friendname } = req.params;
  const response = await confirmRequest(username, friendname);
  return 'success';
};
const removePending = async (req, res) => {
  const { username, friendname } = req.params;
  const results = await deletePending(username, friendname);
  return results;
};
const insertMsg = async (data) => {
  let { time } = data;
  time = time.replace(/[a-zA-Z,:/]/g, ' ');
  time = time.split(' ');
  time = time.filter((el => el != ''));
  time = {
    month: time[0],
    day: time[1],
    year: time[2],
    hour: time[3],
    minute: time[4],
    second: time[5],
  };
  const res = await addMessage(data, time);
};
module.exports = {
  addFriend,
  confirmFriend,
  removePending,
  insertMsg,
};
