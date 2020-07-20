const { deletePending, getPending, addUser, getRequest, confirmRequest, getFriendsList } = require('../models/createUser');

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

const getFriendRequests = async (req, res) => {
  const { username } = req.params;
  let items = await getRequest(username);
  items = items.map(el => { return el.username; });
  return items;
};
const confirmFriend = async (req, res) => {
  const { username, friendname } = req.params;
  const response = await confirmRequest(username, friendname);
  return 'success';
};
const getMyFriends = async (req, res) => {
  const { username } = req.params;
  let results = await getFriendsList(username);
  let friendsList = results.map((el) => {
    return el.friendname;
  });
  return friendsList;
};
const pendingRequests = async (req, res) => {
  const { username } = req.params;
  const results = await getPending(username);
  let pending = results.map((el) => {
    return el.friendname;
  });
  return pending;
};
const removePending = async (req, res) => {
  const { username, friendname } = req.params;
  console.log(friendname);
  const results = await deletePending(username, friendname);
  return results;
};

module.exports = {
  addFriend,
  getMyFriends,
  getFriendRequests,
  confirmFriend,
  pendingRequests,
  removePending,
};
