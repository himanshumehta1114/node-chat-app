// <!-- io() is available in socket.io.js file,it is used to initiate the request we're making a request from the client to the server to open up a web socket and keep up the connection open -->
  var socket = io();
  socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createEmail', {
      to: 'jen@example.com',
      text: 'Hey is sent by client'
    });

    socket.emit('createMessage', {
      to: 'server',
      text: 'Hey this is sent by client'
    });
  });

  socket.on('disconnect',function() {
    console.log('Disconnected from server');
  });

  socket.on('newEmail', function(email) {
    console.log('New email', email);
  });

  socket.on('newMessage', function(msg) {
    console.log('New Message', msg);
  });
