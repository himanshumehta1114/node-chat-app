const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
var app = express();
const publicPath = path.join(__dirname, '../public')

// to use socket.io we have create server using http module instead of express
var server = http.createServer(app);
var io = socketIO(server);

const {generateMessage} = require('./utils/message');

io.on('connection', (socket) => {
  console.log('new User connected');
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (msg,callback) => {
    console.log('createMessage', msg);
    io.emit('newMessage', generateMessage(msg.from,msg.text));
    callback('This is from server.');
    // io.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // });

    // socket.broadcast.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  })
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
