let express = require('express');
let app = express();
let router = express.Router();
const bodyParser = require('body-parser');
let { makeGroup } = require('../controller/groupchat');
let { getGroup, getAllGroups } = require('../models/createUser');
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

module.exports = router;
