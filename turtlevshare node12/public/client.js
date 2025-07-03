/*global hareArray,turtleArray,newPlayerMoney,game,GameObject,playersArray,foodArray,serverMessage,timer,scoreboard,me,users,dragged,tiles,debugInfo,cellSize,normalCurveRand,io,grid,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

var socket = io.connect();;
// var socket = io.connect();
socket.emit('setUsername', localStorage.getItem("username"));
setTimeout(function(){socket.emit('setUsername', localStorage.getItem("username"));},10000)
let users;
let me;

let serverMessageDisplay1 = document.getElementById("serverMessageDisplay1");
let serverMessageDisplay2 = document.getElementById("serverMessageDisplay2");

socket.on('add a new player to playersArray', function(data)
{
  playersArray[data.index] = data.playerObj;
});

socket.on('bet result',function(data){
  //console.log("bet result")
  if (data.alertColor == "green"){
    $("#greenAlert").html(data.alertText);
    $("#greenAlert").show();
    setTimeout(function(){
      $("#greenAlert").hide();
    },5000);
  }else if (data.alertColor == "red"){
    $("#redAlert").html(data.alertText);
    $("#redAlert").show();
    setTimeout(function(){
      $("#redAlert").hide();
    },5000);
  }
});

//recieves timer updates
socket.on('clock tick', function(data)
{
  timer=data;
  //console.log(timer)
});

socket.on('give the new user the full playersArray', function(data)
{
  playersArray=data;
});

socket.on('mystats', function(data)
{
  me = data;
  if(width == null){
    socket.emit("move","width is null");
  }
});

socket.on('remove player', function(data)
{
  playersArray = playersArray.filter(array => array.id != data.id);
});


//top 5 players
socket.on('scoreboard', function(data)
{
  scoreboard = data;
});

//$("#hostModal").modal("show");

socket.on('show host modal', function(data){
  //alert()
  $("#hostModal").modal("show");
  console.log("you ARE the host")
});

socket.on('server message', function(data)
{
  //console.log(data)
  serverMessageDisplay1.innerHTML = data;
  serverMessageDisplay2.innerHTML = data;
});

socket.on('server reset', function(data)
{
  location.reload();
});

socket.on('update game',function(data){
  game = JSON.parse(data);
  //console.log(game);
  // if(game.hareArray.length > hareArray.length){
  //   hareArray = [];
  //   for (let each of game.hareArray){
  //     hareArray.append(each);
  //   }
  // }else{
  //   for (let i=0;i<game.hareArray.length;i++){
  //     hareArray[i].newTransform.p
  //   }
  // }
});

socket.on('update money',function(data){
  newPlayerMoney = data;
})