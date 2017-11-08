// <!-- io() is available in socket.io.js file,it is used to initiate the request we're making a request from the client to the server to open up a web socket and keep up the connection open -->
  var socket = io();
  socket.on('connect', function() {
    console.log('Connected to server');

    // socket.emit('createEmail', {
    //   to: 'jen@example.com',
    //   text: 'Hey is sent by client'
    // });

    // socket.emit('createMessage', {
    //   to: 'server',
    //   text: 'Hey this is sent by client'
    // });
  });

  socket.on('disconnect',function() {
    console.log('Disconnected from server');
  });

  // socket.on('newEmail', function(email) {
  //   console.log('New email', email);
  // });

  socket.on('newMessage', function(msg) {
    console.log('New Message', msg);
    var li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    $('#messages').append(li);
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
      from : 'User',
      text : $('[name = message]').val()
    }, function() {

    });
  });

  var locationButton = $('#send-location');
  locationButton.on('click', function() {
    if(!navigator.geolocation) {
      return alert('Location not supported by browser.');
    }

    navigator.geolocation.getCurrentPosition(function(position){
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
    }, function() {
      console.log('Unable to fetch location');
    })
  });
