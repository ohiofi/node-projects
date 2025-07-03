///// server.js
// where your node app startss

// init project
var scoreboard = {}; // key is username, value is {"score":0,"questionNumber":0}
var clientScoreboard = {};
var fs = require("fs");
console.log(typeof process.env.BLACKLIST);
const BLACKLIST = process.env.BLACKLIST.split(",");

// on server reset load from scores.json
fs.readFile("scores.json", function(err, data) {
  if (err) {
    throw err;
  }
  console.log("loaded from scores.json");
  scoreboard = JSON.parse(data);
  for (var key in scoreboard) {
    if (scoreboard[key].score > 0) {
      clientScoreboard[key] = scoreboard[key].score;
    } else {
      delete scoreboard[key];
    }
  }
});

// Setup basic express server
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static("views"));

// Chatroom
var maxUsers = 99;
var numUsers = 0;

// init questionArray
var questionArray = require("./trivia.json");
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}
shuffle(questionArray);

io.on("connection", function(socket) {
  //var platArray = makeNewPlatforms();
  var addedUser = false;

  //when the client emits 'new question', this listens and executes
  socket.on("new question", function(data) {
    // console.log("new question");
    // console.log(data);
    // console.log(questionArray[data]);
    var servermessage;
    var optionArray = [];
    try {
      if (scoreboard[socket.username].questionNumber < questionArray.length) {
        servermessage =
          questionArray[scoreboard[socket.username].questionNumber].question;
        optionArray.push(
          questionArray[scoreboard[socket.username].questionNumber].answer
        );
        var tempOption = optionArray[0];
        for (var i = 0; i < 5; i++) {
          // Additional options
          while (optionArray.includes(tempOption)) {
            tempOption =
              questionArray[Math.floor(Math.random() * questionArray.length)]
                .answer;
          }
          optionArray.push(tempOption);
        }
        shuffle(optionArray);
      } else {
        servermessage = "Thanks for playing!";
      }
      // sending to individual socketid (private message)
      //io.sockets.connected[clients[socket.username].socketid].emit('update question', {
      socket.emit("update question", {
        message: servermessage,
        options: optionArray
      });
    } catch (err) {
      console.log(err);
      return;
    }
  });

  //when the client emits 'new guess', this listens and executes
  socket.on("new guess", function(data) {
    // console.log(data);
    try {
      scoreboard[socket.username];
    } catch (err) {
      console.log(err);
      return;
    }
    try {
      var triviaQuestionNumber = scoreboard[socket.username].questionNumber;
      var clientGuess = data.toLowerCase();
      // console.log(clientGuess);
      //     console.log(questionArray[triviaQuestionNumber].answer.toLowerCase());

      if (triviaQuestionNumber < questionArray.length) {
        if (
          questionArray[triviaQuestionNumber].answer.toLowerCase() ===
          clientGuess
        ) {
          scoreboard[socket.username].score++;
          clientScoreboard[socket.username]++;
          socket.emit("green background");
          // console.log("++");
        } else {
          scoreboard[socket.username].score--;
          clientScoreboard[socket.username]--;
          socket.emit("red background");
          // console.log("--");
        }
        scoreboard[socket.username].questionNumber++;
      }
      socket.emit("update scoreboard", {
        message: clientScoreboard
      });
      socket.broadcast.emit("update scoreboard", {
        message: clientScoreboard
      });
      var oldscores = JSON.stringify(scoreboard, null, 2);
      fs.writeFile("scores.json", oldscores, finished);
      function finished(err) {
        console.log(err);
        console.log("scores saved to scores.json");
      }
    } catch (err) {
      console.log(err);
      return;
    }
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function(username) {
    // clients[username] = {
    //   "socketid": socket.id
    // };
    if (numUsers > maxUsers) return;
    if (username != null) {
    } else {
      username = Math.random() * 9999;
    }

    if (addedUser) return;
    let lowerUsername = username.toLowerCase();
    console.log(lowerUsername);
    // we store the typedname in the socket session for this client
    socket.typedName = username;
    //if name already in scoreboard
    if (username in scoreboard) {
      username += " " + Math.random() * 9999;
    }
    //blacklist
    if (username in scoreboard || BLACKLIST.indexOf(lowerUsername) > -1) {
      console.log("blacklist match username: " + username);
      console.log(
        "match for blacklist entry: " +
          BLACKLIST[BLACKLIST.indexOf(lowerUsername)]
      );
      username = Math.random() * 9999;
    } else {
      for (let i = 0; i < BLACKLIST.length; i++) {
        if (lowerUsername.includes(BLACKLIST[i])) {
          console.log("username contains blacklist: " + username);
          console.log(
            "match for blacklist entry: " +
              BLACKLIST[BLACKLIST.indexOf(lowerUsername)]
          );
          username = Math.random() * 9999;
          break;
        }
      }
    }
    if (username.length < 1) username = Math.random() * 9999;
    if (username.length > 14) username = username.slice(0, 14);

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    // emit to the new user. emit to the new user. emit to the new user.
    socket.emit("login", {
      numUsers: numUsers,
      username: socket.username
    });
    scoreboard[socket.username] = { score: 0, questionNumber: 0 };
    clientScoreboard[socket.username] = 0;
    socket.emit("update scoreboard", {
      message: clientScoreboard
    });
    // echo globally (all clients) that a person has connected
    // socket.broadcast.emit is only sent to old users not the new user
    socket.broadcast.emit("user joined", {
      //socket.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    console.log(socket.username);
  });

  // when the user disconnects. perform this
  socket.on("disconnect", function() {
    console.log("disconnect");
    if (addedUser) {
      --numUsers;
      if (scoreboard[socket.username].score < 1) {
        delete scoreboard[socket.username];
        delete clientScoreboard[socket.username];
      }
      console.log(numUsers);
      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
setTimeout(function() {
  io.local.emit("server reset", true);
}, 1000);
