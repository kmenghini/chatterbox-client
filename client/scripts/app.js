
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/?order=-createdAt',
  friends: [],
  rooms: [],
  currentRoomSelect: null //set this, check it to filter messages
};


app.checkChars = function(string) {
  // console.log('before', string);
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
  // console.log('after', string);
  return string;
};

app.formatDate = function(dateNum) {
  return moment(dateNum).format('MMMM Do YYYY, h:mm:ss a');
};


app.loadMessages = function(data) {
//debugger;
  console.log(data.results[0]);

  $("#chats").replaceWith('<div id="chats"></div>');
  $("select").replaceWith('<select></select>');
  data.results.forEach(function(element) {
    // console.log(element);
    if (!app.rooms.includes(element.roomname)) {
      app.rooms.push(element.roomname);
    }
    var createdAt = '<p class="timestamp">' + app.formatDate(element.createdAt) + '</p>';
    var objectId = element.objectId;
    var roomname = '<p class="'+ app.checkChars(element.roomname) + '">' + app.checkChars(element.roomname) + '</p>';
    var text = '<p class="text">' + app.checkChars(element.text) + '</p>';
    var updatedAt = element.updatedAt;
    var username = '<h class="username">' + app.checkChars(element.username) + '</h>';
    


    roomCheck = function(element) {
      console.log(app.currentRoomSelect);
      if (app.currentRoomSelect === null) {
        $("#chats").append('<div class="chat">' + username + text + createdAt + roomname + '</div>');
      } else if (element.roomname === app.currentRoomSelect) {
        $("#chats").append('<div class="chat">' + username + text + createdAt + roomname + '</div>');
      }
    };
    //only do the next line, if a selection was made, if the selection matches the roomname
    roomCheck(element);
  
  });
  
  for (var i = 0; i < app.rooms.length; i++) {
    $("select").append('<option value="' + app.rooms[i] + '">' + app.rooms[i] + '</option>');  
  }
  
};

app.fetch = function() {
  var url = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/?order=-createdAt';
  $.get(url, app.loadMessages).then(function() {
    setTimeout(app.fetch, 3000);
  });
  console.log("fetching");
};
//initial fetch invocation


app.send = function(obj) {

  console.log('inside send function');
  console.log(app.currentRoomSelect);
  //console.log($location.search().username);
  //debugger;//when the button is clicked
  var messagePackage = {  //can we say this.text?
    username: window.location.search.split('=')[1],
    roomname: app.currentRoomSelect,
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
    },
    complete: function(data) {
      console.log('inside complete');
      // app.fetch();
    }
  });
  console.log('after ajax');
  //return $.post(this.server, messagePackage, app.fetch() ); //post this object thing
  //need to add a room?  Is that also server side?

};



app.init = function() {
  // $.get(this.server, app.loadMessages);
  app.fetch();

  $('#messageButton').on('click', function () {
    app.send( { text: $('#messageText').val() } ); 
    // app.fetch(); 
  }); 

  $('#roomButton').on('click', function () {
    app.currentRoomSelect = $('select').val(); 
    // app.fetch(); 
  });  

  //when a selection is made, 
    //any #chat that has a child node of .roomname === selection
    //stays  on the page,

    //any chat that doesn't have that child node,
    //apply the "hidden" CSS to it
};



$(document).ready(function() {

  app.init();


//end of $document.ready 
});



