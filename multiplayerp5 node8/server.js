/*global push,pop,translate,rect,rotate*/
// server.js
// where your node app starts
// init project
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


// declare server variables
let players = {};
let foods = [];
let clock = 100; // start the clock at 100
const CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
for(var i=0;i<8;i++){ // start by adding some food
  let randColor = randomChoice(CSS_COLOR_NAMES);
  let randX = Math.floor(Math.random()*800)-400;
  let randY = Math.floor(Math.random()*800)-400;
  foods.push({
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
  socket.userId = Math.floor(Math.random() * (8999999) ) + 1000000; // give user a random ID
  let randColor = randomChoice(CSS_COLOR_NAMES);
  let randX = Math.floor(Math.random()*800)-400;
  let randY = Math.floor(Math.random()*800)-400;
  players[socket.userId.toString()]={
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
  };
  io.sockets.emit('server message', io.engine.clientsCount + " users");
  updatescoreboard();
  socket.emit('mystats',players[socket.userId.toString()]); //emit the playerObj to the player that just joined
  socket.emit('give the new user the full foods',foods); // emit foods to only the player that just joined
  socket.emit('give the new user the full players',players); // emit playerArray to only the player that just joined
  socket.broadcast.emit('add a new player to players',{
    playerObj:players[socket.userId.toString()],
    index:socket.userId
  }); // tell all other players that this dude joined
  
  
  socket.on('setusername', function(data){ // this section happens when the player wants to set their username
    if(data != null)
    {
      if(data.length > 0 && data.length <= 12)
      {
        let nameExists=false;
        for (var key in players) {
          if(players[key].username==data){
            nameExists=true
          }
        }
        if(!nameExists){
          socket.username = data;
          console.log(socket.userId + "-username: " + socket.username);
          players[socket.userId.toString()].username = socket.username;
          updatescoreboard();
          socket.broadcast.emit('server message',socket.username + " joined. " + io.engine.clientsCount + " users remaining."); // emit to all other players
          //socket.emit(); // emit hello to only the player that just set their username
          io.sockets.emit('update username',{
            id:socket.userId,
            username:socket.username,
            index:socket.userId
          }); 
        }
      }
    }
  });
  
  socket.on('move', function(data){ // this section happens when a player wants to move
    let currentPlayer = players[socket.userId.toString()];
    if(data == "ne"){
      currentPlayer.x+=16;  
      currentPlayer.y-=16;  
    }
    else if(data == "se"){
      currentPlayer.x+=16;  
      currentPlayer.y+=16; 
    }
    else if(data == "sw"){
      currentPlayer.x-=16;  
      currentPlayer.y+=16; 
    }
    else if(data == "nw"){
      currentPlayer.x-=16;  
      currentPlayer.y-=16; 
    }
    else if(data == "right"){
      currentPlayer.x+=22;  
    }
    else if(data == "left"){
      currentPlayer.x-=22;
    }
    else if(data == "up"){
      currentPlayer.y-=22
    }
    else if(data == "down"){
      currentPlayer.y+=22
    }
    for(let i = 0; i< foods.length; i++){
      if(dist(currentPlayer.x, foods[i].x, currentPlayer.y, foods[i].y) <= foods[i].w*1.75){
        currentPlayer.score += 5;
        updatescoreboard()
        if(Math.random() > .5) {
          foods[i].x += Math.floor(Math.random() * 400) + 300;
        } else{
          foods[i].x -= Math.floor(Math.random() * 400) + 300;
        }
        if(Math.random() > .5) {
           foods[i].y += Math.floor(Math.random() * 400) + 300;
        } else {
           foods[i].y -= Math.floor(Math.random() * 400) + 300;
        }
        //emit to all sockets
        io.sockets.emit('spawn a piece of food',{
          index:i,
          newX:foods[i].x,
          newY:foods[i].y
        }); 
        updatescoreboard();
        }
      }
    
    // update "me" for the player that just moved only
    socket.emit('mystats',players[socket.userId.toString()]); //emit the playerObj to the player that just joined
    // tell everyone else they moved
    io.sockets.emit('move player',{
      index:socket.userId,
      x:currentPlayer.x,
      y:currentPlayer.y
    });
  });
  
  socket.on('disconnect', function(){ // this section happens when a player leaves
    io.sockets.emit('remove player',{
      id:socket.userId,
      index:socket.userId
    });
    delete players[socket.userId.toString()];
    io.sockets.emit('server message',socket.username + " left. " + io.engine.clientsCount + " users remaining.");
    updatescoreboard();
  });
})

function addPoints(amount, currentPlayer){
  currentPlayer.score += amount
  updatescoreboard();
}

function updatescoreboard(){
  // convert players dictionary to scoreboard array
  let scoreboard = Object.values(players);
  scoreboard.sort((a, b) => b.score - a.score);
  io.sockets.emit('scoreboard', scoreboard);
}

function randomChoice(myArray){
    return myArray[Math.floor(Math.random() * myArray.length)];
}

function moveARandomPieceOfFood(){
  let index = Math.floor(Math.random() * foods.length);
  foods[index].x += Math.floor(Math.random() * 40) - 20;
  foods[index].y += Math.floor(Math.random() * 40) - 20;
  //Centering Force
  foods[index].x *= 0.999;
  foods[index].y *= 0.999;
  //emit to all sockets
  io.sockets.emit('move a piece of food',{
    index:index,
    newX:foods[index].x,
    newY:foods[index].y
  }); 
}
function dist(x1,x2,y1,y2){
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2 - y1, 2))
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