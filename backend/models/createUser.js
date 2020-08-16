const bcrypt = require('bcrypt');
const Connection = require('../database/connection');
const connection = Connection();
const saltRounds = 5;


const getMessages = async(info) => {
  
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
  //get info
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
const getRequest = async (username) => {
  const query = 'SELECT username from friend_status WHERE friendname = $1 and state = $2';
  const values = [username, 1];
  const results = await connection.query(query, values);
  const list = results.rows;
  return list;
};
const confirmRequest = async (username, friendname) => {
  const query = 'UPDATE friend_status SET state = $1 WHERE username = $2 and friendname = $3';
  const values = [3, friendname, username];
  const results = await connection.query(query, values);
  return results;
};
const getFriendsList = async (username) => {
  const query = `SELECT friendname from friend_status WHERE username = $1 and state = $2 
  UNION SELECT username from friend_status where friendname = $3 and state = $4`;
  const values = [username, 3, username, 3];
  const results = await connection.query(query, values);
  const friendsList = results.rows;
  return friendsList;
};
const getPending = async (username) => {
  const query = 'SELECT friendname from friend_status WHERE username = $1 and state = $2';
  const values = [username, 1];
  const results = await connection.query(query, values);
  const list = results.rows;
  return list;
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
  getRequest,
  confirmRequest,
  getFriendsList,
  getPending,
  deletePending,
  addMessage,
  getMessages,
};
