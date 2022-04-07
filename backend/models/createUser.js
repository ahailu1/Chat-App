const bcrypt = require('bcrypt');
const Connection = require('../database/connection');
const connection = Connection();
const saltRounds = 5;

const createGroup = async (object) => {
  //alter table my_groups add primary key(group_id);
  //alter table my_groups add constraint fk_my_groups foreign KEY(group_creator) references users(username);
  let { groupName, groupId, groupDescription, groupCreator } = object;
  let query = 'insert into my_groups(group_name, group_id, group_creator, description,creation_date) values ($1, $2, $3, $4, LOCALTIMESTAMP)';
  let values = [groupName, groupId, groupCreator, groupDescription];
  try {
    let results = await connection.query(query, values);
    return true;
  } catch (err) {
    console.log('some sorta group add error');
    throw new Error('couldnt add group');
  }
};
const insertGroupMessage = async (data) => {
  let { username, groupId, message} = data;
  let query = 'insert into group_chat_messages(group_member_username, group_id, group_message, time_sent) values ($1, $2, $3, current_timestamp)';
  let values = [username, groupId, message];
  try {
    let res = await connection.query(query, values);
  } catch (err) {
    throw new Error('couldnt insert group_message');
  }
};
const fetchGroupMessage = async (groupId) => {
  //alter table group_chat_messages add constraint group_id_fk foreign key(group_id) references my_groups(group_id) on delete cascade;
  let query = "select group_member_username, group_id, group_message, time_sent::timestamp at time zone 'edt' from group_chat_messages where group_id = $1 order by time_sent asc";
  let values = [groupId];
  try {
    let results = await connection.query(query, values);
    let myResults = results.rows;
    return myResults;
  } catch (err) {
    throw new Error('couldnt fetch group chat history');
  }
};

const getGroup = async (username) => {
  let query = 'select * from my_groups where group_creator = $1';
  let values = [username];
  try {
    let myResults = await connection.query(query, values);
    return myResults.rows;
  } catch (err) {
    throw new Error('couldnt get groups')
  }
};
const joinGroup = async (username, groupId) => {
  const query = 'insert into group_members(group_member_username, group_id) values ($1, $2)';
  const values = [username, groupId];
  try {
    const results = await connection.query(query, values);
    return true;
  } catch (err) {
    return false;
  }
};
const getAllGroups = async () => {
  let query = 'select * from my_groups';
  try {
    let results = await connection.query(query);
    return results.rows;
  } catch (err) {
    throw new Error({ error: 'couldnt fetch all groups' });
  }
};
const getGroupMembers = async (groupId) => {
  let query = 'select distinct my_groups.description,group_members.group_member_username, my_groups.group_id, my_groups.group_name from my_groups right join group_members on group_members.group_id = my_groups.group_id where group_members.group_id = $1';
  let values = [groupId];
  try {
    let results = await connection.query(query, values);
    return results.rows;
  } catch (err) {
    return err;
  }
}
const getJoinedGroups = async (username) => {
  let query = 'select group_creator, group_name, group_id, description from my_groups where group_id in (select group_id from group_members where group_member_username = $1)';
  let values = [username];
  try {
    let results = await connection.query(query, values);
    return results.rows;
  } catch (err) {
    throw new Error({ error: `couldnt fetch ${username} groups`});
  }
};
const leaveGroup = async (username, groupId) => {
  let query = 'delete from group_members where group_member_username = $1 and group_id = $2';
  let values = [username, groupId];
  try {
    let results = connection.query(query, values);
  } catch (errr) {
    throw new Error({ message: 'couldnt add user' });
  }
};
const deleteGroup = async (username, groupId) => {
  //alter table group_members add constraint group_members_fk_restraint foreign key(group_id) references my_groups(group_id) on delete cascade;
  let query = 'delete from my_groups where group_creator = $1 and group_id = $2';
  let values = [username, groupId];
  try {
    let results = connection.query(query, values);
  } catch (errr) {
    throw new Error({ message: 'couldnt delete group' });
  }
};

const friendStatus = async (username) => {
  //create table friend_status(username varchar,friendname varchar,state int,username_password varchar,friendname_password varchar,username_isfavourite varchar, friendname_isfavourite varchar, constraint friend_status_composite_pkey primary key(username, friendname), constraint friend_status_username_fk foreign key(username) references users(username), constraint friend_status_friendname_fk foreign key(friendname) references users(username));
  let query = 'SELECT * from friend_status WHERE (username = $1) or (friendname = $2)';
  let values = [username, username];
  try {
    let result = await connection.query(query, values);
    let myresults = result.rows;
    return myresults;
  } catch (err) {
    throw new Error('couldnt fetch');
  }
};

const deleteFriend = async (username,friendname, query) => {
  let queryOne = 'delete from friend_status WHERE username = $1 and friendname = $2';
  let queryTwo = 'delete from friend_status WHERE friendname = $1 and username = $2';
  let finalQuery;
  if (query === 1 || query === '1') {
    finalQuery = queryOne;
  } else {
    finalQuery = queryTwo;
  }
  let values = [username, friendname];
  try {
    let results = await connection.query(finalQuery, values);
    return results.rows;
  } catch (err) {
    throw new Error('couldnt delete friend');
  }
}

const alterFavourites = async (value, username, friendname, reverse) => {
  // if my username is under the 'friendname' category and my friendname is under the username category, then update username is favourite where username = friendname and friendname == username
  let queryOne = 'UPDATE friend_status SET username_isfavourite = $1 WHERE friendname = $2 AND username = $3';
  let queryTwo = 'UPDATE friend_status SET friendname_isfavourite = $1 WHERE username = $2 AND friendname = $3';
  let query;
  if (reverse === 1 || reverse === '1') {
    query = queryOne;
  } else {
    query = queryTwo;
  }

  let values = [value, username, friendname];
  
  try {
    await connection.query(query, values);
  } catch (err) {
    throw new Error('cannot alter favourites');
  }
};

const getAll = async () => {
  const query = 'SELECT username FROM users';
  try {
    const results = await connection.query(query);
    const data = results.rows;
    return data;
  } catch (err) {
    return new Error();
  }
};

const getMessages = async (info) => {
  const { username, friendname } = info;
  const query = `SELECT message, sender, recipient, time::timestamptz at time zone 'EDT' FROM chat_messages WHERE sender = $1 and recipient = $2 UNION SELECT message,sender,recipient,time::timestamptz at time zone 'EDT' FROM chat_messages WHERE sender = $3 and recipient = $4 ORDER BY TIMEZONE ASC`;
  const values = [username, friendname, friendname, username];
  try {
    const results = await connection.query(query, values);
    const data = results.rows;
    return data;
  } catch (err) {
    return new Error();
  }
};

const addMessage = async (info, time) => {
  //  get info
  let { sender, recipient, message } = info;

  const { hour, minute, day, year, month, second } = time;
  const query = 'insert into chat_messages(sender, recipient, message, time) values ($1, $2, $3, current_timestamp)';
  const values = [sender, recipient, message];
  try {
    const result = await connection.query(query, values);
  } catch (err) {
    throw new Error('connection problem');
  }
};

const declineRequest = async (username, friendname) => {

  const query = 'update friend_status SET state = $1 WHERE username = $2 and friendname = $3';
  const values = [4, friendname, username];
  try {
    const result = await connection.query(query, values);
  } catch (er) {
    throw new Error('could not decline request properly');
  }
};


const createUser = async (username, password) => {
  let userPassword = bcrypt.hashSync(password, saltRounds);
  const query = 'insert into users (username, password) VALUES ($1, $2)';
  const values = [username, userPassword];
  try {
    const result = await connection.query(query, values);
  } catch (err) {
    throw new Error('connection problem');
  }
};
let createLock = async (username, password, friendname, query, removelock = false) => {
  const num = parseInt(query);
  let userPassword;
  if (!removelock) {
    userPassword = bcrypt.hashSync(password, saltRounds);
  } else {
    userPassword = password;
  }
  const queryOne = 'update friend_status set username_password = $1 where friendname = $2 AND username = $3';
  const queryTwo = 'update friend_status set friendname_password = $1 where username = $2 AND friendname = $3';
  const values = [userPassword, username, friendname];
  try {
    if (num === 1) {
      connection.query(queryOne, values);
    } else {
      connection.query(queryTwo, values);
    }
  } catch (err) {
    throw new Error('couldnt set password for some reason');
  }
};
let loginLock = async (username, friendname, query) => {
  const queryOne = 'select username_password from friend_status where friendname = $1 and username = $2';
  const queryTwo = 'select friendname_password from friend_status where username = $1 AND friendname = $2';
  let select = query === 1 ? queryOne : queryTwo;
  let values = [username, friendname];
  try {
    let res = await connection.query(select, values);
    let results = res.rows;
    return results;
  } catch (e) {
    throw new Error('something happened');
  }
}

let removeLock = async (username, friendname, password, query) => {
  let userPassword = bcrypt.hashSync(password, saltRounds);
  const queryOne = 'update friend_status set username_password = $1 where friendname = $2';
  const queryTwo = 'update friend_status set friendname_password = $1 where username = $2';
  const values = [null, username, friendname];
  try {
    if (query == 1 || '1') {
      connection.query(queryOne, values);
    } else {
      connection.query(queryTwo, values);
    }
  } catch (err) {
    throw new Error('couldnt set password for some reason');
  }
};
const getUser = async (username) => {
  const query = 'SELECT username FROM users WHERE username = $1';
  const values = [username];
  const result = await connection.query(query, values);
  let { length } = result.rows;
  let userExists;
  if (length > 0) {
    userExists = true;
  } else {
    userExists = false;
  }
  return userExists;
};
const getPassword = async (username) => {
  const query = 'SELECT password FROM users WHERE username = $1';
  const values = [username];
  const result = await connection.query(query, values);
  let { password } = result.rows[0];
  return password;
};

const addUser = async (username, friendname) => {
  const query = 'insert into friend_status (username, friendname, state) VALUES ($1, $2, $3)';
  const values = [username, friendname, 1];
  try {
    await connection.query(query, values);
  } catch (err) {
    throw new Error();
  }
};

const confirmRequest = async (username, friendname) => {
  const query = 'UPDATE friend_status SET state = $1 WHERE username = $2 and friendname = $3';
  const values = [3, friendname, username];
  const results = await connection.query(query, values);
  return results;
};

const deletePending = async (username, friendname) => {
  const query = 'Delete FROM friend_status WHERE username = $1 and friendname = $2 and state = $3';
  const values = [username, friendname, 1];
  const results = await connection.query(query, values);
};
module.exports = {
  createUser,
  getUser,
  getPassword,
  addUser,
  confirmRequest,
  deletePending,
  deleteFriend,
  addMessage,
  getMessages,
  getAll,
  declineRequest,
  alterFavourites,
  friendStatus,
  removeLock,
  createLock,
  loginLock,
  createGroup,
  getGroup,
  getAllGroups,
  joinGroup,
  getJoinedGroups,
  getGroupMembers,
  leaveGroup,
  deleteGroup,
  insertGroupMessage,
  fetchGroupMessage,
};
