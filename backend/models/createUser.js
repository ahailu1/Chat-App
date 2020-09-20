const bcrypt = require('bcrypt');
const Connection = require('../database/connection');
const connection = Connection();
const saltRounds = 5;



const createGroup = async (object) => {
  let { groupName, groupId, groupDescription, groupCreator } = object;
  let query = 'insert into my_groups(group_name, group_id, group_creator, description,creation_date) values ($1, $2, $3, $4, LOCALTIMESTAMP)';
  let values = [groupName, groupId, groupCreator, groupDescription];
  try {
    connection.query(query, values);
  } catch (err) {
    console.log(err);
    throw new Error('couldnt add group')
  }
};
const getGroup = async (username) => {
  let query = 'select * from my_groups where group_creator = $1';
  let values = [username];
  try {
    let myResults = await connection.query(query, values);
    return myResults.rows;
  } catch (err) {
    console.log(err);
    throw new Error('couldnt get groups')
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

const friendStatus = async (username) => {
  let query = 'SELECT * from friend_status WHERE (username = $1) or (friendname = $2)';
  console.log(username + 'is a retard');
  let values = [username, username];
  try {
    let result = await connection.query(query, values);
    let myresults = result.rows;
    console.log(myresults);
    return myresults;
  } catch (err) {
    throw new Error('couldnt fetch');
  }
};


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
    console.log('return messages erros');
    return new Error();
  }
};

const getMessages = async (info) => {
  const { username, friendname } = info;
  const query = 'SELECT message, sender, recipient, time FROM chat_messages WHERE sender = $1 and recipient = $2 UNION SELECT message,sender,recipient,time FROM chat_messages WHERE sender = $3 and recipient = $4 ORDER BY TIME ASC';
  const values = [username, friendname, friendname, username];
  try {
    const results = await connection.query(query, values);
    const data = results.rows;
    return data;
  } catch (err) {
    console.log('return messages error');
    return new Error();
  }
};

const addMessage = async (info, time) => {
  //  get info
  let { sender, recipient, message } = info;

  const { hour, minute, day, year, month, second } = time;
  const query = 'insert into chat_messages(sender, recipient, message, time) values ($1, $2, $3, make_timestamp($4, $5, $6, $7, $8, $9))';
  const values = [sender, recipient, message, year, month, day, hour, minute, 0];
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
    console.log('right sdaasdsasdahere');
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
let createLock = async (username, password, friendname, query) => {
  let num = parseInt(query);
  let userPassword = bcrypt.hashSync(password, saltRounds);
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

let removeLock = async (username, friendname,password, query) => {
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
    console.log('cant add user');
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
};
