/*global camera,players,foods,serverMessage,timer,scoreboard,me,users,dragged,tiles,debugInfo,cellSize,normalCurveRand,io,grid,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

var socket = io.connect();
const usernameText = document.getElementById('usernameInput');
let users;
let me;
let scoreboard;

$(window).on('load',function(){
  $('#myModal').modal('show');
});

function submitUsername(){
  console.log(usernameText.value);
  $('#myModal').modal('hide');
  socket.emit('setusername', usernameText.value);
  usernameText.value="";
}

function preventBehavior(e) {
  e.preventDefault(); 
};

document.onkeydown = function(e)
{
  if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) {
    socket.emit("move","nw");
    return 
  }
  if (keyIsDown(65) && keyIsDown(87)) {
    socket.emit("move","nw");
    return 
  }
  if (keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)) {
    socket.emit("move", "ne");
    return
  }
  if (keyIsDown(87) && keyIsDown(68)) {
    socket.emit("move","ne");
    return 
  }
  if (keyIsDown(RIGHT_ARROW) && keyIsDown(DOWN_ARROW)) {
    socket.emit("move","se");
    return
  }
  if (keyIsDown(83) && keyIsDown(68)) {
    socket.emit("move","se");
    return 
  }
  if (keyIsDown(LEFT_ARROW) && keyIsDown(DOWN_ARROW)) {
    socket.emit("move","sw");
    return
  }
  if (keyIsDown(65) && keyIsDown(87)) {
    socket.emit("move","sw");
    return 
  }
  switch (e.keyCode)
  {
    case 13: // enter
      console.log(13);
      if(document.activeElement === document.getElementById('usernameInput')){
        console.log("active");
        submitUsername();
      }
      //moving with
    case 87: // w
      //console.log(87);
      socket.emit("move","up");
      break;
    case 38: // up
      //console.log(38)
      socket.emit("move","up");
      break;
    case 65: // a
      //console.log(65)
      socket.emit("move","left");
      break;
    case 37: // left
      //console.log(37)
      socket.emit("move","left");
      break;
    case 83: // s
      //console.log(83);
      socket.emit("move","down");
      break;
    case 40: // down
      //console.log(40);
      socket.emit("move","down");
      break;
    case 68: // d
      //console.log(68);
      socket.emit("move","right");
      break;
    case 39: // right
      //console.log(39);
      socket.emit("move","right");
      break;
  }
}

//recieves timer updates
socket.on('timer tick', function(data)
{
  timer=data;
});


socket.on('give the new user the full foods', function(data)
{
  foods=data;
});


socket.on('give the new user the full players', function(data)
{
  players=data;
});


socket.on('update username', function(data)
{
  players[data.index.toString()].username = data.username;
});


socket.on('add a new player to players', function(data)
{
  players[data.index.toString()] = data.playerObj;
});

socket.on('move player', function(data)
{
  players[data.index.toString()].newX = data.x;
  players[data.index.toString()].newY = data.y;
});

socket.on('remove player', function(data)
{
  //players = players.filter(array => array.id != data.id);
  delete players[data.id];
});


socket.on('move a piece of food', function(data)
{
  foods[data.index].newX=data.newX;
  foods[data.index].newY=data.newY;
});

socket.on('spawn a piece of food', function(data)
{
  foods[data.index].newX=data.newX;
  foods[data.index].newY=data.newY;
  foods[data.index].x=data.newX;
  foods[data.index].y=data.newY;
});


socket.on('server message', function(data)
{
  serverMessage=data;
});


socket.on('mystats', function(data)
{
  me = data;
  if(width == null){
    socket.emit("move","width is null");
  } else{
    camera.newX = me.x - width/2
    camera.newY = me.y - height/2
  }
});


//top 5 players
socket.on('scoreboard', function(data)
{
  scoreboard = data;
});


socket.on('server reset', function(data)
{
  location.reload();
});