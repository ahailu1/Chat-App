const cors = require('cors');
const express = require('express');
let redis = require('redis');
const app = express();
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const homeRoute = require('./routes/homeRoute');
const chat = require('./routes/chat');
const chatbox = require('./routes/chatbox');
const groupchat = require('./routes/groupchat');
const server = http.createServer(app);
const io = socketio(server);
const { insertMsg } = require('./controller/addFriend');
const { insertGroupMessage } = require('./models/createUser');
const friendsList = require('./routes/friendslist');

//  const sessionInit = require('./middleware/session.js');
let client = redis.createClient();
app.set('port', (process.env.Port || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use('/api', homeRoute);
app.use('/chat', chat);
app.use('/chat/friendslist', friendsList);
app.use('/chat/chatbox', chatbox);
app.use('/chat/groups', groupchat);

client.on('connect', () => {
  console.log('connected redis server');
});

client.lrange('messagedata', 0, -1, (err, res) => {
});

io.on('connect', (socket) => {
  socket.on('message', ({ room, message, sender, recipient, time }) => {
    let response = {
      room,
      sender,
      time,
      message,
      recipient,
    };
    insertMsg(response);
    io.emit(room, response);
    socket.on('disconnect', () => {
    });
  });
  socket.on('groupMessage', (data) => {
    let { groupId, message } = data;
    insertGroupMessage(data);
    io.emit(groupId, data);
  }); 
});
server.listen(app.get('port') || 5000, () => {
  console.log(`server is listening  on ${app.get('port')}`);
});
