/*global playersArray,foodArray,serverMessage,timer,scoreboard,me,users,dragged,tiles,debugInfo,cellSize,normalCurveRand,io,grid,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

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
    case 38: // up
      // ?
      break;
    case 65: // a
    case 37: // left
      // ?
      break;
    case 83: // s
    case 40: // down
      // ?
      break;
    case 68: // d
    case 39: // right
      socket.emit("move","right");
      break;
  }
}

//recieves timer updates
socket.on('timer tick', function(data)
{
  timer=data;
});


socket.on('give the new user the full foodArray', function(data)
{
  foodArray=data;
});


socket.on('give the new user the full playersArray', function(data)
{
  playersArray=data;
});


socket.on('update username', function(data)
{
  playersArray[data.index].username = data.username;
});


socket.on('add a new player to playersArray', function(data)
{
  playersArray[data.index] = data.playerObj;
});

socket.on('move player', function(data)
{
  playersArray[data.index].newX = data.x;
  playersArray[data.index].newY = data.y;
});

socket.on('remove player', function(data)
{
  playersArray = playersArray.filter(array => array.id != data.id);
});


socket.on('move a piece of food', function(data)
{
  foodArray[data.index].newX=data.newX;
  foodArray[data.index].newY=data.newY;
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