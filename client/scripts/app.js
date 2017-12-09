
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/?order=-createdAt'
};


app.checkChars = function(string) {
  if (!string) {
    string = '';
  }
  var specialChars = ['&', '<', '>', '\"', '\'', ',', '!', '@', '$', '%', '(', ')', '=', '+', '{', '}', '[', ']'];
  for (var i = 0; i < string.length; i++) {
    if (specialChars.includes(string[i])) {
      var arr = string.split('');
      arr[i] = ' ';
      string = arr.join('');
    }
  }
  return string;
};

app.formatDate = function(dateNum) {
  return moment(dateNum).format('MMMM Do YYYY, h:mm:ss a');
};

app.loadMessages = function(data) {
  data.results.forEach(function(element) {
    // console.log(element);
    var createdAt = '<p class="timestamp">' + app.formatDate(element.createdAt) + '</p>';
    var objectId = element.objectId;
    var roomname = '<p class="roomname">' + app.checkChars(element.roomname) + '</p>';
    var text = '<p class="text">' + app.checkChars(element.text) + '</p>';
    var updatedAt = element.updatedAt;
    var username = '<h class="username">' + app.checkChars(element.username) + '</h>';
    $("#chats").append('<div class="chat">' + username + text + createdAt + roomname + '</div>');
    
  });
};

app.fetch = function() {
  return $.get(this.server, app.loadMessages);
};
//initial fetch invocation


app.send = function(obj) {

  console.log('inside send function');
  //debugger;//when the button is clicked
  
  var messagePackage = {  //can we say this.text?
    username: window.location.search,  //FIX ME
    roomname: '4',
    text: null
  };
  messagePackage.text = obj.text;
  //_.extend(messagePackage, obj);
  //console.log(obj);  

  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(messagePackage),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox sent your message.');
    },
    error: function(data) {
      console.log('chatterbox failed to POST your message hint hint');
    }
  });
  console.log($.ajax.args[0][0].type);
  app.fetch();
  //return $.post(this.server, messagePackage, app.fetch() ); //post this object thing
  //need to add a room?  Is that also server side?

};



app.init = function() {
  
  app.fetch();

  $('#messageButton').on('click', function () {
    app.send( { text: $('#messageText').val() } );  
  });

// $('#messageButton').on('click', 'button',
//       $('#messageText').val()
//     , console.log);

};



$(document).ready(function() {

  app.init();


//end of $document.ready 
});



