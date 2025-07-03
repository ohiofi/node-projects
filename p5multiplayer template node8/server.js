/*global push,pop,translate,rect,rotate*/
// server.js
// where your node app starts
// init project
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


// declare server variables
let playersArray = [];
let foodArray = [];
let scoreArray = [];
let clock = 100; // start the clock at 100
const CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
for(let i=0;i<8;i++){ // start by adding some food
  let randColor = randomChoice(CSS_COLOR_NAMES);
  let randX = Math.floor(Math.random()*800)+200;
  let randY = Math.floor(Math.random()*400)+200;
  foodArray.push({
    x:randX,
    y:randY,
    newX:randX,
    newY:randY,
    rotation:Math.floor(Math.random()*360),
    w:15,
    h:15,
    type:"food",
    color:randColor
  });
}


// web socket starts when a new user joins
io.on('connection', function(socket){
  // emit help
  //
  // emit back to the "sender" player
  //  socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
  //
  // emit to all players except the "sender" player
  //  socket.broadcast.emit('broadcast', 'hello friends!');
  //
  // emit to all players
  //  io.sockets.emit('countdown', clock);
  
  
  // this section happens when the user first connects to the server
  socket.userId = Math.floor(Math.random() * (99999 - 10000) ) + 10000; // give user a random ID
  let randColor = randomChoice(CSS_COLOR_NAMES);
  let randX = Math.floor(Math.random()*800)+200;
  let randY = Math.floor(Math.random()*400)+200;
  playersArray.push({
    id: socket.userId,
    username: socket.userId,
    score: 0,
    x:randX,
    y:randY,
    newX:randX,
    newY:randY,
    rotation:Math.floor(Math.random()*360),
    w:30,
    h:30,
    type:"player",
    color:randColor
  });
  socket.emit('userstats', {
    rank: (scoreArray.findIndex(array => array.id == socket.userId)+1),
    info: scoreArray.find(array => array.id == socket.userId)
  });
  io.sockets.emit('server message', io.engine.clientsCount + " users");
  updatescoreboard();
  socket.emit('mystats',playersArray.find(array => array.id == socket.userId)); //emit the playerObj to the player that just joined
  socket.emit('give the new user the full foodArray',foodArray); // emit foodArray to only the player that just joined
  socket.emit('give the new user the full playersArray',playersArray); // emit playerArray to only the player that just joined
  socket.broadcast.emit('add a new player to playersArray',{
    playerObj:playersArray.find(array => array.id == socket.userId),
    index:playersArray.findIndex(array => array.id == socket.userId)
  }); // tell all other players that this dude joined
  
  
  socket.on('setusername', function(data){ // this section happens when the player wants to set their username
    if(data != null)
    {
      if(data.length > 0 && data.length <= 12)
      {
        let nameExists=false;
        playersArray.forEach(function(currentValue){if(currentValue.username==data){nameExists=true}});
        if(!nameExists){
          socket.username = data;
          console.log(socket.userId + "-username: " + socket.username);
          playersArray.find(array => array.id == socket.userId).username = socket.username;
          socket.emit('userstats', {
            rank: (scoreArray.findIndex(array => array.id == socket.userId)+1),
            info: scoreArray.find(array => array.id == socket.userId)});
          updatescoreboard();
          socket.broadcast.emit('server message',socket.username + " joined. " + io.engine.clientsCount + " users remaining."); // emit to all other players
          //socket.emit(); // emit hello to only the player that just set their username
          io.sockets.emit('update username',{
            id:socket.userId,
            username:socket.username,
            index:playersArray.findIndex(array => array.id == socket.userId)
          }); 
        }
      }
    }
  });
  
  socket.on('move', function(data){ // this section happens when a player wants to move
    let currentPlayer = playersArray.find(array => array.id == socket.userId)
    if(data == "right"){
      currentPlayer.x+=5;
    }
    // update "me" for the player that just moved only
    socket.emit('mystats',playersArray.find(array => array.id == socket.userId)); //emit the playerObj to the player that just joined
    // tell everyone else they moved
    io.sockets.emit('move player',{
      index:playersArray.findIndex(array => array.id == socket.userId),
      x:currentPlayer.x,
      y:currentPlayer.y
    });
  });
  
  socket.on('disconnect', function(){ // this section happens when a player leaves
    io.sockets.emit('remove player',{
      id:socket.userId,
      index:playersArray.findIndex(array => array.id == socket.userId)
    });
    playersArray = playersArray.filter(array => array.id != socket.userId);
    io.sockets.emit('server message',socket.username + " left. " + io.engine.clientsCount + " users remaining.");
    updatescoreboard();
  });
})





function addPoints(user, amount){
  playersArray.find(array => array.id == user).points += amount;
  scoreArray.find(array => array.id == user).points = playersArray.points;
  updatescoreboard();
}


function updatescoreboard(){
  let top5players = [...scoreArray];
  top5players.sort((a, b) => b.points - a.points);
  top5players = top5players.slice(0,5);
  io.sockets.emit('scoreboard', top5players);
}


function randomChoice(myArray){
    return myArray[Math.floor(Math.random() * myArray.length)];
}


function moveARandomPieceOfFood(){
  let index = Math.floor(Math.random() * foodArray.length);
  foodArray[index].x += Math.floor(Math.random() * 40) - 20;
  foodArray[index].y += Math.floor(Math.random() * 40) - 20;
  //emit to all sockets
  io.sockets.emit('move a piece of food',{
    index:index,
    newX:foodArray[index].x,
    newY:foodArray[index].y
  }); 
}


setInterval(function(){ // loop that keeps the clock ticking and the food moving
  if(clock<=0){
    clock=100 // reset the clock to 100
  }
  clock--;
  io.sockets.emit('timer tick', clock); //emit to all sockets
  moveARandomPieceOfFood();
},100);


setTimeout(function(){ // this only happens if the server freezes and restarts
  io.sockets.emit('server reset', true);
}, 1000);