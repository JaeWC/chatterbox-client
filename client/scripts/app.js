var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
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
    $(document).on('click', '.roomname', filterRoom);
    $(document).on('change', '#roomSelect', filterRoom);
  },

  cleanData: function(unsafe) {
    unsafe = unsafe || 'NA';
    return encodeURIComponent(unsafe);
  },

  fetch: function() {
    var context = this;

    // var where = {}

    // extend where defaults
    // if (context.currentRoom !== undefined) {
    //   _.extend(where, {roomname: context.currentRoom});
    // }
    $.ajax({
      url: context.server,
      type: 'GET',
      data: JSON.stringify(message),
      success: function(data) {
        context.renderRoom(data);
        context.renderMessage(data);
      },
      error: function() {
        console.log('chatterbox: Failed to get message');
      }
    });
  },

  send: function(message) {
    var context = this;
    console.log("Sent!");

    var defaults = {
      username: $('#user').val(),
      text: $('#message').val(),
      roomname: $('#room').val()
    };

    console.log(typeof message);
    var message = message || defaults;

    $.ajax({
      url: context.server,
      type: 'POST',
      data: JSON.stringify(message),
      dataType: 'application/json',
      success: function() {
        $('#status').text('Your message was successfully sent!').addClass('success');
      },
      error: function() {
        $('#status').text('Your message failed :(').addClass('failure');
      }
    });
  },

  clearMessages: function() {
    var $chats = $('#chats');
    $chats.children().remove();
  },

  renderMessage: function (messages) {
    var context = this;
    $('#chats').children().remove();
    var $messageList = $('#chats');

    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var username = this.cleanData(message.username);
      var text = this.cleanData(message.text);
      var roomname = this.cleanData(message.roomname);


      var messageDiv =
        '<div class="message">' +
          '<div class="row">' +
            '<div class="col6">' +
              '<a class="username">' + username + '</a>' +
            '</div>' +
            '<div class="col6 text-right">' +
              '<a class="roomname">' + roomname + '</a>' +
            '</div>' +
          '</div>' +
          '<p class="text">' + text + '</p>' +
        '</div>';
      $messageList.prepend(messageDiv);
    }
  },

  addRoom: function(roomName) {
    var $roomSelect = $('#roomSelect');
    $roomSelect.append('<option>' + roomName + '</option>');
  },

  filterRoom: function(roomName) {
    this.clearMessages();
    this.currentRoom = roomName;
    this.fetch();
  },

  renderRoom: function (message) {
    var $options = $('#roomSelect');
    for (var i = 0; i < message.length; i++) {
      var room = this.cleanData(message[i].roomname);

      if (!(room in this.rooms)) {
        var option = '<option>' + room + '</option>';
        $options.append(option);
        this.rooms[room] = true;
      }
    }
  }
};

$(document).ready(function() {
  app.init();
});
