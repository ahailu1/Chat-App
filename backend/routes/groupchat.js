let express = require('express');
let app = express();
let router = express.Router();
const bodyParser = require('body-parser');
let { makeGroup } = require('../controller/groupchat');
let { getGroup, getAllGroups, joinGroup, getJoinedGroups, getGroupMembers } = require('../models/createUser');
router.post('/create', async (req, res) => {
  let {
    groupId, groupName, groupDescription, groupCreator,
  } = req.body;
  let obj = {
    groupId, groupName, groupDescription, groupCreator,
  };
  try {
    let insertGroup = await makeGroup(obj);
  } catch (err) {
    throw new Error('something happened');
  }
  res.status(200).send({msg: 'hello'});
});
router.get('/mygroups/:username', async (req, res) => {
  let {username} = req.params;
  console.log(username + 'is trying to be here');
  console.log('hello im trying here in groups y naa')

  try {
    let groupData = await getGroup(username);
    console.log('herre in groups');
    console.log(groupData);
    res.status(200).send({ groupData: groupData });
  } catch (err) {
    res.status(422).send({error: 'couldnt fetch group'})
  }
});
router.get('/allgroups', async (req, res) => {
  try {
    let allGroups = await getAllGroups();
    res.status(200).send(allGroups);
  } catch (err) {
    res.status(422).send({ error: 'couldnt fetch all groups' });
  }
});
router.get('/join/:groupid/:username', async (req, res) => {
  let { username, groupid } = req.params;
  console.log(groupid);
  try {
    let join = await joinGroup(username, groupid);
    if (join === true) {
      res.status(200).send({ message: 'user successfully added to group' });
    }
  } catch (err) {
    res.status(422).send({ message: 'user couldnt be added to group' });
  }
});
router.get('/joinedgroups/:username', async (req, res) => {
  let { username } = req.params;
  console.log(username + 'get his joined groups');
  try {
    let joinedGroups = await getJoinedGroups(username);
    res.status(200).send(joinedGroups);
  } catch (err) {
    res.status(422).send({ error: 'couldnt fetch all groups' });
  }
});
router.get('/groupinfo/:groupname', async (req, res) => {
  let { groupname } = req.params;
  try {
    let groupMembers = await getGroupMembers(groupname);
    res.status(200).send({ groupMembers: groupMembers });
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt fetch group members'});
  }
});

module.exports = router;
