let express = require('express');
let app = express();
let router = express.Router();
let cors = require('cors');

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { upload, uploadPic } = require('../controller/uploadProfile');
let { fetchGroupMessage, getGroup, getAllGroups, joinGroup, getJoinedGroups, getGroupMembers, leaveGroup, deleteGroup, createGroup } = require('../models/createUser');
app.use(cors());

router.post('/creategroup', cors(), async (req, res) => {
  let {
    groupId, groupName, groupDescription, groupCreator,
  } = req.body;
  let obj = {
    groupId, groupName, groupDescription, groupCreator,
  };
  try {
    await createGroup(obj);
    res.status(200).send({ errorMsg: 'its working' });
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt add group member' });
  }
});
router.get('/mygroups/:username', async (req, res) => {
  let {username} = req.params;

  try {
    let groupData = await getGroup(username);
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
router.get('/profilepicture/:groupId', async (req, res, next) => {
  let pathaz = path.resolve(__dirname, '../../front-end/src/images');
  let groupId = `${req.params.groupId}--profilepicture.png`;
  let defaultUsername = 'default--profilepicture.png';
  let profilePath = path.join(pathaz, `/${groupId}`);
  // check if path exists. if it does, send the route to the path, otherwise send the route to the default profile picture;
  fs.access(profilePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ default: defaultUsername });
    } else {
      res.status(200).send({ profilePicture: groupId });
    }
  });
  res.set('Content-Type', 'image/png');
});


router.post('/profilepicture/:groupId', upload.single('avatar'), async (req, res) => {
  let group = true;
  try {
    await uploadPic(req, res, group);
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt upload picture' });
  }
});
router.get('/chathistory/:groupId', async (req, res) => {
  let {groupId} = req.params;
  try {
    let results = await fetchGroupMessage(groupId);
    res.status(200).send({ msgHistory: results });
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt retrieve message history'});
  }
});
router.get('/leavegroup/:groupId/:username', async (req, res) => {
  let { username, groupId } = req.params;
  try {
    let response = await leaveGroup(username, groupId);
    res.status(200).send({ message: 'user successfully removed from group' });
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt leave group. Please try again' });
  }
});
router.get('/deletegroup/:groupId/:username', async (req, res) => {
  let { username, groupId } = req.params;
  try {
    let response = await deleteGroup(username, groupId);
    res.status(200).send({ message: 'successfully deleted group' });
  } catch (err) {
    res.status(422).send({ errorMsg: 'couldnt delete group. Please try again' });
  }
});
module.exports = router;
