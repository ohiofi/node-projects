// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = require("express")();

const cookieParser = require("cookie-parser");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var ejs = require("ejs");
// var io = require('socket.io')(app.listen(1337));
// var io = require('socket.io')(app.listen(1337));
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

// Google Auth
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "88713995697-nii4pt4khb53arcbqud3gv5evkound65.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Middleware
// Setup ejs
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

// listen for requests :)
const listener = server.listen(PORT, () => {
  console.log("Your server is listening on port " + listener.address().port);
});

// declare server variables
const state = {
  PREGAME: 0,
  LINEUP: 1,
  FIRSTHALF: 2,
  PLACEBETS: 3,
  SECONDHALF: 4,
  PROCESSVICTORY: 5,
  GAMEOVER: 6
};
let playerMemory = {};
let userDict = {};
let game = {
  gameState: state.PREGAME,
  hareArray: [],
  hareCount: 0,
  jumbotronText: "Race",
  player: null,
  raceNumber: 1,
  scoreboard: {
    turtleHeading: { name: "🐢 TURTLE WINS", wins: 0 },
    hareHeading: { name: "🐇 HARE WINS", wins: 0 },
    turtleRacers: [],
    hareRacers: []
  },
  leaderboard:[],
  turtleArray: [],
  turtleCount: 0
};
let scoreArray = [];
//let gameHost = null;
let userJoinOrder = 0;

let clock = 0; //start the clock at 0

var Turtle = require("./Turtle.js");
// console.log(Turtle.test)
// console.log(Turtle.turtleNames);
shuffle(Turtle.turtleNames);

var Hare = require("./Hare.js");

shuffle(Hare.hareNames);

var PlayerObject = require("./PlayerObject.js");
game.player = new PlayerObject();

// web socket starts when a new user joins
io.on("connection", function(socket) {
  //socket.id = socket.id; // Each new connection is assigned a random 20-characters identifier.

  console.log(socket.id);
  userDict[socket.id] = {
    id: socket.id,
    username: socket.id,
    score: 0,
    userMoney: 150,
    isHost:false,
    userJoinOrder:userJoinOrder,
    currentBet: { amount: 0, species: null, name: null }
  };
  console.log(userDict[socket.id]);
  if(userJoinOrder == 0){
    //console.log("yo host")
    userDict[socket.id].isHost = true;
    //gameHost = socket.id;
    setTimeout(function(){io.to(socket.id).emit("show host modal")},1000);
    //io.to(userDict[socket.id].id).emit("show host modal");
    //setTimeout(function(){socket.broadcast.emit("show host modal")},1000);
  }
  userJoinOrder++;
  

  socket.on("betEasy", function(data) {
    console.log(data)
    userDict[socket.id].currentBet = {
      amount: parseInt(data.amount),
      species: data.species,
      name: null
    };
    userDict[socket.id].betPlaced = true;
  });

  socket.on("betBig", function(data) {
    console.log(data)
    userDict[socket.id].currentBet = {
      amount: parseInt(data.amount),
      species: null,
      name: data.name
    };
    userDict[socket.id].betPlaced = true;
  });
  
  socket.on("host start game",function(){
    console.log("host start game")
    if(userDict[socket.id].isHost && game.gameState == state.PREGAME){
      game.gameState = state.LINEUP;
      clock = 1000;
    }
  })

  // set the username
  socket.on("setUsername", function(data) {
    if (!(data in playerMemory)){
      playerMemory[data] = 150;
    }else{
      userDict[socket.id].userMoney = playerMemory[data];
      userDict[socket.id].betPlaced = false;
      io.to(userDict[socket.id].id).emit("update money",userDict[socket.id].userMoney);
    }
    console.log("Google username = " + data);
    if (data != null) {
      if (data.length > 0) {
        socket.username = data;
        console.log(socket.id + "-username: " + socket.username);
        userDict[socket.id].username = socket.username;
        socket.emit("userstats", {
          rank: scoreArray.findIndex(array => array.id == socket.id) + 1,
          info: scoreArray.find(array => array.id == socket.id)
        });
        updateLeaderboard();
        socket.broadcast.emit(
          "server message",
          socket.username +
            " joined. " +
            io.engine.clientsCount +
            " users remaining."
        ); // emit to all other players
        //socket.emit(); // emit hello to only the player that just set their username
        io.sockets.emit("update username", {
          id: socket.id,
          username: socket.username,
          userMoney: userDict[socket.id].userMoney
        });
      }
    }
  });

  socket.on("disconnect", function() {
    // this section happens when a player leaves
    io.sockets.emit("remove player", {
      id: socket.id
    });
    delete userDict[socket.id];
    //if(!isHostSet()){
      // find new host
    
    //}
    io.sockets.emit(
      "server message",
      socket.username + " left. " + io.engine.clientsCount + " users remaining."
    );
    updateLeaderboard();
  });
});

function addNewTurtle() {
  game.turtleCount++;
  let temp = new Turtle(0, 450 + game.turtleCount * 50, Turtle.turtleNames[game.turtleCount]);
  //console.log(temp);
  game.scoreboard.turtleRacers.splice(0, 0, {
    name: temp.name,
    wins: 0,
    type: "Turtle"
  });
  game.turtleArray.splice(0, 0, temp);
}

function addNewHare() {
  game.hareCount++;
  let temp2 = new Hare(0, 500 - game.hareCount * 50, Hare.hareNames[game.hareCount]);
  //scoreboard.hareRacers.splice(0, 0, { name: temp2.name, wins: 0, type: "Hare" });
  game.scoreboard.hareRacers.push({ name: temp2.name, wins: 0, type: "Hare" });
  // push hare to end of objects array
  //objects.splice(0, 0, temp2);
  game.hareArray.push(temp2);
}

function checkBet(user, winner) {
  //console.log("check bet")
  if (user.currentBet.amount == 0){
    return
  }
  let punct = ["!", ""];
  
  let alertColor = "";
  let alertText = "";
  // easy money win
  if (
    user.currentBet.species != null &&
    user.currentBet.species == winner.constructor.name
  ) {
    user.userMoney += user.currentBet.amount * 2;
    alertText =
      choice(PlayerObject.positive) + choice(punct) + " <span style='white-space: nowrap;'>+$" + user.currentBet.amount * 2 + "</span>";
    alertColor = "green";
    // easy money lose
  } else if (
    user.currentBet.species != null &&
    user.currentBet.species != winner.constructor.name
  ) {
    user.userMoney -= user.currentBet.amount;
    alertText =
      choice(PlayerObject.negative) + choice(punct) + " <span style='white-space: nowrap;'>-$" + user.currentBet.amount+ "</span>";
    alertColor = "red";
    // big money win
  } else if (
    user.currentBet.name != null &&
    user.currentBet.name == winner.name
  ) {
    user.userMoney += user.currentBet.amount * 5;
    alertText =
      choice(PlayerObject.positive) + choice(punct) + " <span style='white-space: nowrap;'>+$" + user.currentBet.amount * 5+ "</span>";
    alertColor = "green";
    // big money lose
  } else if (
    user.currentBet.name != null &&
    user.currentBet.name != winner.name
  ) {
    user.userMoney -= user.currentBet.amount;
    alertText =
      choice(PlayerObject.negative) + choice(punct) + " <span style='white-space: nowrap;'>-$" + user.currentBet.amount+ "</span>";
    alertColor = "red";
  }
  user.currentBet = { amount: 0, species: null, name: null };
  // to individual socketid (private message)
  let data = {alertColor:alertColor, alertText:alertText};
  
  io.to(user.id).emit("bet result",data);
  io.to(user.id).emit("update money",user.userMoney);
  updateLeaderboard();
}

function choice(list) {
  var index = Math.floor(Math.random() * list.length);
  return list[index];
}

function doNext() {
  game.player.update();
  //updatePlayerMoney();
  switch (game.gameState) {
    case state.PREGAME:
      if(clock % 5 == 0){
        //console.log(gameHost())
        //console.log("show host modal")
        io.to(gameHost()).emit("show host modal");
        
        //io.sockets.emit("show host modal","kjsdf")
      }
      game.jumbotronText = "Waiting for host";
      io.sockets.emit("server message","Waiting for host")
      break;
    case state.LINEUP:
      // code block
      
      if(clock >= 1005){
        clock = 2000;
        game.gameState = state.FIRSTHALF;
        
        if(game.raceNumber == 30){
          game.jumbotronText = "! ! ! FINAL RACE ! ! !";
          io.sockets.emit("server message","! ! ! FINAL RACE ! ! !")
          
        }else{
          game.jumbotronText = "Race " + game.raceNumber;
          io.sockets.emit("server message","Race "+(game.raceNumber))
        }
      }else{
        if(game.raceNumber == 30){
          game.jumbotronText = "FINAL RACE begins in "+(1005-clock);
          io.sockets.emit("server message","FINAL RACE begins in "+(1005-clock))
          
        }else{
          game.jumbotronText = "Race "+(game.raceNumber)+" begins in "+(1005-clock);
          io.sockets.emit("server message","Race "+(game.raceNumber)+" begins in "+(1005-clock))
        }
        
      }
      break;
    case state.FIRSTHALF:
      moveRacers();
      break;
    case state.PLACEBETS:
      // code block
      if(isBettingDone() || clock >= 3020){
        clock = 4000;
        game.gameState = state.SECONDHALF;
        if(game.raceNumber == 30){
          game.jumbotronText = "! ! ! FINAL RACE ! ! !";
          io.sockets.emit("server message","! ! ! FINAL RACE ! ! !")
        }else{
          game.jumbotronText = "Race " + game.raceNumber;
          io.sockets.emit("server message","Race "+(game.raceNumber))
        }
      }else{
        io.sockets.emit("server message","Race continues in "+(3020-clock))
        game.jumbotronText = "Race continues in "+(3020-clock);
      }
      break;
    case state.SECONDHALF:
      moveRacers();
      break;
    case state.PROCESSVICTORY:
      // code block
      break;
    case state.GAMEOVER:
      // code block
      if(clock >= 6030){
        clock = 0;
        resetGame();
        io.sockets.emit("server message","Race "+(game.raceNumber))
        game.jumbotronText = "Race " + game.raceNumber;
      }else{
        io.sockets.emit("server message","GAME OVER. Reset in "+(6030-clock))
        game.jumbotronText = "GAME OVER. Reset in "+(6030-clock);
      }
      break;
    default:
    // code block
  }
  io.sockets.emit("update game", JSON.stringify(game));
}

function gameHost() {
  let minimum = 999999;
  let newHost = "no host";
  for (let eachUser in userDict){
    if(userDict[eachUser].userJoinOrder < minimum){
      minimum = userDict[eachUser].userJoinOrder;
      newHost = eachUser;
    }
  }
  if(userDict[newHost] != undefined){
    userDict[newHost].isHost = true;
  }
  return newHost
}

function isBettingDone(){
  for (let eachUser in userDict){
    if(userDict[eachUser].betPlaced == false){
      return false;
    }
  }
  return true;
}

function isHostSet(){
  for (let eachUser in userDict){
    if(userDict[eachUser].isHost == true){
      return true;
    }
  }
  return false;
}

function moveRacers() {
  const objects = game.turtleArray.concat(game.hareArray);
  for (let each of objects) {
    //each.show();
    if (
      game.gameState == state.FIRSTHALF ||
      game.gameState == state.SECONDHALF
    ) {
      each.update();
      if (each.x < 850 && each.x > game.player.newTransform.position.x - 150) {
        game.player.newTransform.position.x = each.x + 120;
        if (each.x > 600) {
          game.player.newTransform.position.z = each.z - 100;
        }
      }
    }
    // place your bets
    if (game.gameState == state.FIRSTHALF && each.x >= 500) {
      game.gameState = state.PLACEBETS;
      clock = 3000
      //playerMoney = newPlayerMoney;
      //$("#myModal").modal("show");
    }
    // check for victory
    if (game.gameState == state.SECONDHALF && each.x > 1000) {
      game.gameState = state.PROCESSVICTORY;
      const winner = each;
      io.sockets.emit("server message",winner.name + " Wins!")
      processVictory(winner);
      break
    }
  }
}

function processVictory(winner) {
  io.sockets.emit("server message",winner.name + " Wins!!!")
  game.gameState = state.PROCESSVICTORY;
  winner.x = 1000;
  game.player.newTransform.position.x = winner.x;
  game.player.newTransform.position.z = winner.z;
  winner.winner = true;
  winner.energy = 2;
  winner.speed -= (Math.random() * 0.1 + Math.random() * 0.1 + Math.random() * 0.1 + 0.1);
  winner.speed = Math.abs(winner.speed);
  game.jumbotronText += ": " + winner.name + " Wins!";
  // find name on scoreboard
  let tempArray = game.scoreboard.turtleRacers.concat(
    game.scoreboard.hareRacers
  );
  for (let entry of tempArray) {
    if (entry.name == winner.name) {
      entry.wins++;
      if (winner.constructor.name == "Hare") {
        //console.log("hare win")
        game.scoreboard.hareHeading.wins++;
        if (game.turtleCount < 10) {
          addNewTurtle();
        }
      } else {
        //console.log("turtle win win")
        game.scoreboard.turtleHeading.wins++;
        if (game.hareCount < 10) {
          addNewHare();
        }
      }
      //writeScoreboard();
      
      //fillRacerSelectDropdown();
      break;
    }
  }
  for (let eachUser in userDict){
    checkBet(userDict[eachUser], winner);
  }
  
  const objects = game.turtleArray.concat(game.hareArray);
  // speed up losers
  for (let loser of objects) {
    if (loser == winner) {
      continue;
    }
    loser.speed += (Math.random() * 0.04 + Math.random() * 0.04 - 0.02);
    loser.secondWind *= 1.05
    if(winner.class != loser.class){
      loser.energy *= 2;
      loser.speed += 0.01;
      loser.secondWind += 0.01;
    }
  }
  if (game.raceNumber < 30){
    setTimeout(lineup, 5000);
  } else {
    game.gameState = state.GAMEOVER;
    clock = 6000;
  }
  
}

function lineup() {
  clock = 1000;
  game.gameState = state.LINEUP;
  let totalRacers = game.scoreboard.turtleRacers.length + game.scoreboard.hareRacers.length;
  ////cam.setParent(player, 600, 250);
  //cam.setParent(player, 160 + 5*totalRacers, 160 + 5*totalRacers);
  //cam.setParent(player, 160 + 5*totalRacers, 160 + 5*totalRacers);

  game.raceNumber++;
  const objects = game.turtleArray.concat(game.hareArray);
  for (let each of objects) {
    each.x = 0;
    each.winner = false;
  }
  for (let eachUser in userDict) {
    userDict[eachUser].betPlaced = false;
  }
  game.player.newTransform.position.z = 450 - 55 * game.hareCount;
  game.player.newTransform.position.x = 0;

  // setTimeout(function() {
  //   game.gameState = state.FIRSTHALF;
  // }, 4000);
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
}

function resetGame() {
  clock = 0;
  game = {
    gameState: state.PREGAME,
    hareArray: [],
    hareCount: 0,
    jumbotronText: "Race",
    player: null,
    raceNumber: 1,
    scoreboard: {
      turtleHeading: { name: "🐢 TURTLE WINS", wins: 0 },
      hareHeading: { name: "🐇 HARE WINS", wins: 0 },
      turtleRacers: [],
      hareRacers: []
    },
    leaderboard:[],
    turtleArray: [],
    turtleCount: 0
  }
  game.player = new PlayerObject();
  addNewHare();
  addNewTurtle();
  game.player.transform.position.x = 100;
  game.player.newTransform.position.x = 100;
  game.player.transform.position.z = 450;
  game.player.newTransform.position.z = 450;
  game.player.transform.rotation.y = -20;
  for (let eachUser in userDict) {
    userDict[eachUser].betPlaced = false;
    //userDict[eachUser].userMoney = 150;
    //io.to(userDict[eachUser].id).emit("update money",userDict[eachUser].userMoney);
  }
}

function updateLeaderboard() {
  //scoreArray.sort((a, b) => b.points - a.points);
  //let top5players = scoreArray.slice(0,5);
  //io.sockets.emit('scoreboard', top5players);
  game.leaderboard = []
  for(let eachUser in userDict){
    game.leaderboard.push({name:userDict[eachUser].username,money:userDict[eachUser].userMoney})
    playerMemory[userDict[eachUser].username] = userDict[eachUser].userMoney;
  }
  //console.log(game.leaderboard)
}

setInterval(function() {
  //io.sockets.emit("game object", game);
}, 20);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   //response.sendFile(__dirname + "/views/index.html");
//   //response.render("index")
//   response.redirect('/login');
// });
app.get("/", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("game", { user });
});

app.get("/game", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("game", { user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("session-token");
  res.redirect("/login");
});

app.get("/profile", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("profile", { user });
});

app.get("/protectedroute", checkAuthenticated, (req, res) => {
  res.render("protectedroute.ejs");
});

app.post("/login", (req, res) => {
  let token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log(payload);
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
});

function checkAuthenticated(req, res, next) {
  let token = req.cookies["session-token"];
  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch(err => {
      res.redirect("/login");
    });
}

resetGame();

setInterval(function() {
  // loop that keeps the clock ticking
  // if (clock <= 0) {
  //   clock = 100; // reset the clock to 100
  // }
  clock++;
  io.sockets.emit("clock tick", clock); //emit to all sockets
}, 1000);

setInterval(function(){
  doNext();
},20);

setTimeout(function() {
  // this only happens if the server freezes and restarts
  io.sockets.emit("server reset", true);
}, 1000);
