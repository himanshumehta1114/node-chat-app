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

io.on('connection', (socket) => {
  console.log('new User connected');

  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'Hey.Hello',
    createdAt: 123
  });

  socket.emit('newMessage', {
    from: 'server',
    text: 'this is sample message from server',
    createdAt: 145
  });

  socket.on('createMessage', (msg) => {
    // io.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // });

    socket.broadcast.emit('newMessage', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    })
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  })
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
