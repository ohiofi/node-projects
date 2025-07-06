   /*global scoreboard,noise,push,pop,rect,resizeCanvas,createCanvas,color,translate,triangle,frameRate,beginShape,endShape,curveVertex,shuffle,sin,cos,floor,rotate,textAlign,LEFT,RIGHT,CENTER,text,textSize,stroke,noStroke,strokeWeight,keyCode,keyIsDown,LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,mouseIsPressed,fill,noFill,mouseX,mouseY,line,ellipse,background,displayWidth,displayHeight,windowWidth,windowHeight,height,width,dist,loadSound,loadImage,image,random,angleMode,RADIANS,DEGREES*/

// create variables up here
let gameState = "titleScreen"
let foobar = 500;
let serverMessage = "hello"
let timer;
let foods = [];
let players = {};
let cellSize = 100
let randcolor
let cowimg, dogimg, catimg, pigimg, chickenimg;

let camera = {
  x: 100,
  y: 100,
  newX: 0,
  newY: 0,
}

function preload(){
  cowimg = loadImage("https://cdn.glitch.com/a324a43a-12d8-4dbf-8770-1337fde200d3%2Fcow1.png?1558369404157");
  pigimg = loadImage("https://cdn.glitch.com/a324a43a-12d8-4dbf-8770-1337fde200d3%2Fpig1.png?1558369404293");
  dogimg = loadImage("https://cdn.glitch.com/a324a43a-12d8-4dbf-8770-1337fde200d3%2Fdog1.png?1558369404142");
  catimg = loadImage("https://cdn.glitch.com/a324a43a-12d8-4dbf-8770-1337fde200d3%2Fcat1.png?1558369404237");
  chickenimg = loadImage("https://cdn.glitch.com/a324a43a-12d8-4dbf-8770-1337fde200d3%2Fchicken1.png?1558369404080");
}
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
    text("eie.io",width/2,140)
    text("press SPACE",width/2,180)
    
}
  if(gameState == "inGame"){
   
    textAlign(LEFT)
    for(let i = 0; i < Math.floor(width / cellSize) + 3; i++){
      for(let j = 0; j < Math.floor(height / cellSize) + 3; j++){
        let r = noise(floor((camera.x-camera.x%cellSize+i*cellSize)/cellSize)) * 255
        let g = noise(floor((camera.y-camera.y%cellSize+j*cellSize)/cellSize)) * 255
        let b = noise(floor((camera.x-camera.x%cellSize+i*cellSize)/cellSize)+floor((camera.y-camera.y%cellSize+j*cellSize)/cellSize)) * 255 
        
        fill(color(r, g, b ))
        stroke(255);
        rect(i * cellSize + (-camera.x % cellSize - cellSize), j * cellSize + (-camera.y % cellSize - cellSize), cellSize, cellSize)
        fill(175);
        stroke(0)
        text(floor((camera.x-camera.x%cellSize+i*cellSize)/cellSize), i * cellSize + (-camera.x % cellSize) - 90, j * cellSize + (-camera.y % cellSize) - 80)
        text(floor((camera.y-camera.y%cellSize+j*cellSize)/cellSize), i * cellSize + (-camera.x % cellSize) - 20, j * cellSize + (-camera.y % cellSize) - 80)
    }
  }
    
    translate(-camera.x,-camera.y);
    moveFood();
    showFood();
    movePlayers();
    showPlayers();
    translate(camera.x,camera.y);
    moveCamera();
    showUIText();
  }
}


function moveFood(){
  for (let i = foods.length-1; i >= 0; i--) { // reversed in case food is removed
    foods[i].rotation += 0.05;
    foods[i].x = glide(foods[i].x,foods[i].newX);
    foods[i].y = glide(foods[i].y,foods[i].newY);
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
  for (let i = foods.length-1; i >= 0; i--) { // reversed in case food is removed
    push();
    translate(foods[i].x,foods[i].y);
    fill(foods[i].color);
    rotate(foods[i].rotation);
    stroke(255);
    rect(-foods[i].w/2,-foods[i].h/2,foods[i].w,foods[i].h);
    pop();
  };
}


function movePlayers(){
  //for (let i = players.length-1; i >= 0; i--) { // reversed in case player is removed
  for(let i in players){
    players[i].x = glide(players[i].x,players[i].newX);
    players[i].y = glide(players[i].y,players[i].newY);
  };
}


function showPlayers(){
  //for (let i = players.length-1; i >= 0; i--) { // reversed in case player is removed
  for(let i in players){
    push();
    stroke(0);
    translate(players[i].x,players[i].y);
    fill(players[i].color);
    // username
    image(picRandomImage(players[i].id),-25,-25, 50, 50)
    textAlign(CENTER);
    textSize(16);
    text(players[i].username,0,-Math.sqrt(Math.pow(players[i].w/2, 2) + Math.pow(players[i].h/2, 2)))
    // player shape
    //rotate(players[i].rotation);
    //rect(-players[i].w/2,-players[i].h/2,players[i].w,players[i].h);
    pop();
  };
}

function moveCamera(){
  camera.x = glide(camera.x, camera.newX);
  camera.y = glide(camera.y, camera.newY);
  // if(camera.x > camera.newX){
  //   //camera.x -= 1
  // }
  // else if(camera.x < camera.newX){
  //   //camera.x += 1
  // }
  // if(camera.y < camera.newY){
  //   //camera.y += 1
  // }
  // else if(camera.y > camera.newY){
  //   camera.y -= 1
  // }
}

function keyPressed(){
  if(gameState == "titleScreen" && keyCode === 32){
    gameState = "inGame"
  }
}


function showUIText(){
  stroke(0);
  fill(255);
  textAlign(LEFT);
  textSize(16);
  text("Timer: "+timer,20,20);
  textAlign(CENTER);
  text("eie.io",width/2,20)
  textAlign(RIGHT);
  text(serverMessage,width-20,20);
  scoreboard.sort(function(a, b){return b.score - a.score});
  for(let i = 0; i< scoreboard.length; i++){
    text(scoreboard[i].username + ":" + scoreboard[i].score, width-50, 50+40*i)
  }
}



function windowResized(){ // update canvas size if window changed
  resizeCanvas(windowWidth, windowHeight);
}

function picRandomImage(id){
  let image
  if(id % 5 == 0){
    image = cowimg;
  }
  else if(id % 5 == 1){
    image = pigimg;
  }
  else if(id % 5 == 2){
    image = chickenimg;
  }
  else if(id % 5 == 3){
    image = dogimg;
  }
  else{
    image = catimg;
  }
  return image
}