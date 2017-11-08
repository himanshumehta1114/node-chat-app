// <!-- io() is available in socket.io.js file,it is used to initiate the request we're making a request from the client to the server to open up a web socket and keep up the connection open -->
  var socket = io();

  function scrollToBottom (){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
      messages.scrollTop(scrollHeight);
    }
  }

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
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
      text: msg.text,
      from: msg.from,
      createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
  });

  socket.on('newLocationMessage', function(msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#message-location-template').html();
    var html = Mustache.render(template, {
      url: msg.url,
      from: msg.from,
      createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
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
