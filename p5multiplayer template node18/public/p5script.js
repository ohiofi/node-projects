/*global push,pop,rect,resizeCanvas,createCanvas,color,translate,triangle,frameRate,beginShape,endShape,curveVertex,shuffle,sin,cos,floor,rotate,textAlign,LEFT,RIGHT,CENTER,text,textSize,stroke,noStroke,strokeWeight,keyCode,keyIsDown,LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,mouseIsPressed,fill,noFill,mouseX,mouseY,line,ellipse,background,displayWidth,displayHeight,windowWidth,windowHeight,height,width,dist,loadSound,loadImage,image,random,angleMode,RADIANS,DEGREES*/

// create variables up here
let gameState = "titleScreen"
let foobar = 500;
let serverMessage = "hello"
let timer;
let foodArray = [];
let playersArray = [];


function setup(){ // only when game loads
  createCanvas(windowWidth,windowHeight);
}


function draw(){ // this is a built-in forever loop
  if(gameState == "titleScreen"){
    background("orange")
    stroke(255);
    fill(0);
    textSize(30);
    textAlign(CENTER);
    text("Multiplayer P5 Template",width/2,140)
    text("press SPACE",width/2,180)
  }
  if(gameState == "inGame"){
    background("lightblue");
    moveFood();
    showFood();
    movePlayers();
    showPlayers();
    showUIText();
  }
}


function moveFood(){
  for (let i = foodArray.length-1; i >= 0; i--) { // reversed in case food is removed
    foodArray[i].rotation += 0.05;
    foodArray[i].x = glide(foodArray[i].x,foodArray[i].newX);
    foodArray[i].y = glide(foodArray[i].y,foodArray[i].newY);
  };
}


function glide(currentCoordinate,newCoordinate){
  if(currentCoordinate == newCoordinate){
    return currentCoordinate
  }
  if (Math.abs(currentCoordinate - newCoordinate)<.2){
    return currentCoordinate=newCoordinate;
  } else {
    return currentCoordinate+=(newCoordinate - currentCoordinate)*.09;
  }
}


function showFood(){
  for (let i = foodArray.length-1; i >= 0; i--) { // reversed in case food is removed
    push();
    translate(foodArray[i].x,foodArray[i].y);
    fill(foodArray[i].color);
    rotate(foodArray[i].rotation);
    stroke(255);
    rect(-foodArray[i].w/2,-foodArray[i].h/2,foodArray[i].w,foodArray[i].h);
    pop();
  };
}


function movePlayers(){
  for (let i = playersArray.length-1; i >= 0; i--) { // reversed in case player is removed
    playersArray[i].x = glide(playersArray[i].x,playersArray[i].newX);
    playersArray[i].y = glide(playersArray[i].y,playersArray[i].newY);
  };
}


function showPlayers(){
  for (let i = playersArray.length-1; i >= 0; i--) { // reversed in case player is removed
    push();
    stroke(0);
    translate(playersArray[i].x,playersArray[i].y);
    fill(playersArray[i].color);
    // username
    textAlign(CENTER);
    textSize(16);
    text(playersArray[i].username,0,-Math.sqrt(Math.pow(playersArray[i].w/2, 2) + Math.pow(playersArray[i].h/2, 2)))
    // player shape
    rotate(playersArray[i].rotation);
    rect(-playersArray[i].w/2,-playersArray[i].h/2,playersArray[i].w,playersArray[i].h);
    pop();
  };
}


function keyPressed(){
  if(gameState == "titleScreen" && keyCode === 32){
    gameState = "inGame"
  }
}


function showUIText(){
  stroke(255);
  fill(0);
  textAlign(LEFT);
  textSize(16);
  text("Timer: "+timer,20,20);
  textAlign(CENTER);
  text("Multiplayer P5 Template",width/2,20)
  textAlign(RIGHT);
  text(serverMessage,width-20,20);
}



function windowResized(){ // update canvas size if window changed
  resizeCanvas(windowWidth, windowHeight);
}