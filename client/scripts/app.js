var app = {
  server: 'http://52.78.213.9:3000/messages',
  currentRoom: undefined,
  rooms: {},

  init: function() {
    var context = this;

    setInterval(function() {
      context.fetch();
    }, 2000);

    var filterRoom = function() {
      var $element = $(this);
      var name = $element.val() || $element.text();

      context.filterRoom(name);
    };

    $('#send-message').click(function(elem) {
      elem.preventDefault();
      context.send();
    });

    $(document).on('click', '#roomSelect', filterRoom);

    $('#create-room').on('click', function(elem) {
      var newRoom = prompt('Enter new Room : ');
      $newRoomBtn = $('<li><button id=' + newRoom + '>' + newRoom + '</button></li>');
      $('#roomSelect').append($newRoomBtn);
    });
  },

  fetch: function() {
    var context = this;

    $.ajax({
      url: 'http://52.78.213.9:3000/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (messages) {
        console.log('chatterbox: Message sent');

        context.renderMessage(messages);
        context.renderRoom(messages);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  send: function(message) {
    var defaults = {
      username: $('#user').val(),
      text: $('#message').val(),
      roomname: $('#room').val()
    };
    var message = message || defaults;
    console.log(message);

    $.ajax({
      url: 'http://52.78.213.9:3000/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  clearMessages: function() {
    var $chats = $('#chats');
    $chats.children().remove();
  },

  renderMessage: function (message) {
    $('#chats').html('');
    var $chatlsit = $('<div id="chatlist"></div>');
    $('#chats').append($chatlsit);


    for (var i = 0; i < message.length; i++) {
   
      var content = message[i];

      var username = content.username.replace(/<\/?[^>]+(>|$)/g, '');
      var text = content.text.replace(/<\/?[^>]+(>|$)/g, '');
      var roomname = content.roomname.replace(/<\/?[^>]+(>|$)/g, '');
      var date = content.date;


      if (!username.includes('<alert>') || !text.includes('<alert>') || !roomname.includes('<alert>')) {
        var $messageDiv = $('<div class="jumbotron" "row"><div class="user" "col6"><strong>' + username + '</strong></div><div class="text" "col6">' + text + '</div><div class="room">' + roomname + '</div><div>' + date + '</div></div>');
        $('#chats').prepend($messageDiv);
      }

    }
  },

  addRoom: function() {
    var $roomSelect = $('#roomSelect');
    $roomSelect.append('<li><button id=' + roomname + ' class="roomname">' + roomname + '</button></li>');
  },

  filterRoom: function(roomName) {
    this.clearMessages();
    this.currentRoom = roomName;
    this.fetch();
  },

  renderRoom: function (message) {
    $('#roomSelect').children().remove();

    var temp = [];
    for (var i = 0; i < message.length; i++) {
      var content = message[i];
      var roomname = content.roomname;

      if (!temp.includes(roomname)) {
        var $roombtn = $('<li><button id=' + roomname + ' class="roomname">' + roomname + '</button></li>');
        $('#roomSelect').append($roombtn);
        temp.push(roomname);
      }
    }
  }
};

$(document).ready(function() {
  app.init();
});

