const cors = require('cors');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const fetch = require('node-fetch');
const socketio = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const homeRoute = require('./routes/homeRoute');
const chat = require('./routes/chat');
const server = http.createServer(app);
const io = socketio(server);
const friendsList = require('./routes/friendslist');
//  const sessionInit = require('./middleware/session.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(homeRoute);
app.use('/chat', chat);
app.use('/chat/friendslist', friendsList);

io.on('connect', (socket) => {
  socket.on('message', ({ room, message, sender, recipient, time }) => {
    console.log(message);
    let response = {
      room,
      sender,
      time,
      message,
      recipient,
    };
    console.log(response);
    io.emit(room, response);
    console.log(message);
    socket.on('disconnect', () => {
      io.emit(recipient, 'a user has left the chat');
    });
  });
});
server.listen(process.env.port || 5000);
