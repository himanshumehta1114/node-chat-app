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

  socket.on('newLocationMessage', function(msg) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current Location</a>');
    li.text(`${msg.from}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = $('[name = message]');

    socket.emit('createMessage', {
      from : 'User',
      text : $('[name = message]').val()
    }, function() {
      messageTextBox.val('');
    });
  });

  var locationButton = $('#send-location');
  locationButton.on('click', function() {
    if(!navigator.geolocation) {
      return alert('Location not supported by browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location');

    navigator.geolocation.getCurrentPosition(function(position){
      locationButton.removeAttr('disabled').text('Send Location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
    }, function() {
      locationButton.removeAttr('disabled').text('Send Location');
      console.log('Unable to fetch location');
    })
  });
