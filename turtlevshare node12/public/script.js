/*global socket,game,shininess,ambientMaterial,Camera,texture,ellipsoid,ambientLight,directionalLight,createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
let timer = 0;
let playersArray = [];


/*global hareCount,resizeCanvas,Hare,Turtle,Camera,texture,ellipsoid,ambientLight,directionalLight,createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/
let scoreboardDiv;
let leaderboardDiv;
let smallScreenAdjustment = 0;
let moneyDisplay1 = document.getElementById("playerMoneyDisplay1");
let moneyDisplay2 = document.getElementById("playerMoneyDisplay2");
let playerWager1 = document.getElementById("yourWagerDropdown1");
let playerWager2 = document.getElementById("yourWagerDropdown2");
let collapse1 = document.getElementById("collapseOne");
let collapse2 = document.getElementById("collapseTwo");
let racerSelect = document.getElementById("racerSelectDropdown");
let score = 0;
let myFont;
let game = {
  gameState: 0,
  hareArray: [],
  hareCount: 0,
  jumbotronText: "Race",
  leaderboard: {
    users:[]
  },
  player: new GameObject(),
  raceNumber: 1,
  scoreboard: {
    turtleHeading: { name: "🐢 TURTLE WINS", wins: 0 },
    hareHeading: { name: "🐇 HARE WINS", wins: 0 },
    turtleRacers: [],
    hareRacers: []
  },
  turtleArray: [],
  turtleCount: 0
};
let player = new GameObject();
let playerMoney = 150;
let newPlayerMoney = playerMoney;
let playerMoneySpan;
let cam = new Camera();
let shell;
let green;
let turtleArray = [];
let hareArray = [];

let jumbotronZ = 1100;
let floorColor, skyColor;

let raceCount = 1;
let betPlaced = false;
let currentBet = { amount: 0, species: null, name: null };
let scoreboard = {
  turtleCount:0,
  hareCount:0,
  turtleHeading: { name: "🐢 TURTLE WINS", wins: 0 },
  hareHeading: { name: "🐇 HARE WINS", wins: 0 },
  turtleRacers: [],
  hareRacers:[]
};
function preload() {
  myFont = loadFont(
    "./PressStart2P.ttf"
  );
  // shell = loadImage(
  //   "https://cdn.glitch.com/af6937ef-c502-4da1-9b5c-a6f459aabd0f%2Fturtle%20shell.jpg?v=1618927590685"
  // );
  // green = loadImage(
  //   "https://cdn.glitch.com/af6937ef-c502-4da1-9b5c-a6f459aabd0f%2Fgreen%20texture.jpg?v=1618927667270"
  // );
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);
  // setup the camera
  //cam.setParent(player, 600, 250);
  //cam.setParent(player, 150 + 22.5*2, 187.5 + 3.125 * 2);
  if (width < 800){
    smallScreenAdjustment = 1200 - width;
  }else{
    smallScreenAdjustment = 0;
  }
  cam.setParent(
                player,
                160 + smallScreenAdjustment * 1,
                160 + smallScreenAdjustment * 1
               );
  player.transform.position.x = 100;
  player.newTransform.position.x = 100;
  //player.newTransform.position.x = 0;
  player.transform.position.z = 450;
  player.newTransform.position.z = 450 + Math.floor(smallScreenAdjustment * 0.20);
  player.transform.rotation.y = -20
  //cam.setPosition(-200,400,-200)
  //cam.lookAt(300,0,300)

 

  scoreboardDiv = document.createElement("div"); // Create a <div> element
  leaderboardDiv = document.createElement("div"); // Create a <div> element
  createHUD();
  writeScoreboard();
  fillRacerSelectDropdown();
  floorColor = color(190, 220, 190);
  skyColor = color(150,200,250)
}

function draw() {
  background(skyColor);
  ambientLight(128);
  directionalLight(255, 255, 255, 1, -1, 1);
  directionalLight(0, 0, 128, -1, 1, -1);
  //checkPlayerControls();
  cam.update();
  //player.show()
  drawFloor();
  push();
  translate(player.transform.position.x, 80, player.transform.position.z)
 
  rotateY(player.transform.rotation.y)
 
  
  translate(0, 0, jumbotronZ + smallScreenAdjustment);
  rotateX(25);
  drawText(game.jumbotronText,"gray");
  pop();
  // label the x and z axis
  // push();
  // translate(1000, 0, 0);
  // rotateY(90);
  // drawText("X+", "red", 10);
  // pop();
  // push();
  // translate(0, 0, 1000);
  // drawText("Z+", "blue", 10);
  // pop();
  
  //let objects = game.turtleArray.concat(game.hareArray);
  for (let each of game.turtleArray) {
    showTurtle(each)
  }
  for (let each of game.hareArray) {
    showHare(each)
  }
  
  // if (!betPlaced && each.x >= 500) {
  //     //playerMoney = newPlayerMoney;
  //     $("#bettingModal").modal("show");
  //   }
  updateLocalPlayer();
  updatePlayerMoney();
  player.update();
  switch (game.gameState) {
    case 0: // pregame
      //writeScoreboard();
      writeLeaderboard();
      break
    case 1: // lineup
      reset();
      writeScoreboard();
      writeLeaderboard();
      $("#bettingModal").modal("hide");
      //fillRacerSelectDropdown();
      break
    case 2: // firsthalf
      $("#bettingModal").modal("hide");
      fillRacerSelectDropdown();
      updateWagerSelectDropdown()
      betPlaced = false;
      break
    case 3: // placebets
      if(!betPlaced){
        $("#bettingModal").modal("show");
      }
      break
    case 4: // secondhalf
        $("#bettingModal").modal("hide");
      break
    case 5: // processvictory
      writeScoreboard();
      writeLeaderboard();
      betPlaced = false;
      $("#bettingModal").modal("hide");
      break
    case 6: // gameover
      writeScoreboard();
      writeLeaderboard();
      break
  }
}


function updateLocalPlayer(){
  player.newTransform.position.x = game.player.newTransform.position.x;
  player.newTransform.position.z = game.player.newTransform.position.z + Math.floor(smallScreenAdjustment * 0.20);
  if(smallScreenAdjustment>0){
    player.newTransform.rotation.y = game.player.newTransform.rotation.y*0.2;
  }else{
    player.newTransform.rotation.y = game.player.newTransform.rotation.y;
  }
  // player.newTransform.rotation.y = game.player.newTransform.rotation.y;
}

function fillRacerSelectDropdown(){
  let previouslySelected = racerSelect.value;
  let result = "";
  let objects = game.turtleArray.concat(game.hareArray);
  for(let each of objects){
    result += "<option value="+each.name
    if(previouslySelected == each.name){
      result += " selected "
    }
    result += ">"+each.name+"</option>"
  }
  racerSelect.innerHTML = result;
}

function updateWagerSelectDropdown(){
  let previouslySelected1 = playerWager1.value;
  let result = "";
  let counter = 25;
  result += "<option value="+counter
  if(previouslySelected1 == counter){
      result += " selected "
  }
  result += ">" + counter + "</option>"
  while(counter * 2 <= newPlayerMoney){
    counter *= 2;
    result += "<option value="+counter
    if(previouslySelected1 == counter){
      result += " selected "
    }
    result += ">" + counter + "</option>"
    
  }
  playerWager1.innerHTML = result;
  let previouslySelected2 = playerWager1.value;
  result = "";
  counter = 25;
  result += "<option value="+counter
    if(previouslySelected2 == counter){
      result += " selected "
  }
  result += ">" + counter + "</option>"
  while(counter * 2 <= newPlayerMoney){
    counter *= 2;
    result += "<option value="+counter
    if(previouslySelected2 == counter){
      result += " selected "
    }
    result += ">" + counter + "</option>"
    
  }
  playerWager2.innerHTML = result;
}

function updatePlayerMoney() {
  if (playerMoney == newPlayerMoney){
    playerMoneySpan.style.color = "white";
    return
  }
  else if (playerMoney < newPlayerMoney) {
    playerMoney+=5;
    playerMoneySpan.style.color = "green";
  } else if (playerMoney > newPlayerMoney) {
    playerMoney--;
    playerMoneySpan.style.color = "red";
  } 
  playerMoneySpan.innerHTML =
    "$" + playerMoney;
  moneyDisplay2.innerHTML = playerMoney;
}

function choice(list) {
  var index = Math.floor(Math.random() * list.length);
  return list[index];
}

function checkBet(winner) {
  let punct = ["!",""];
  let positive = ["Nice","Cool","Good Job","Sweet","Well Done","Neat","Boss","Fancy","Dandy","Devine","Keen","Swell","Glorious","Hunky-Dory","Marvelous","Nifty","Sensational","Noice","Sick","Gucci","Lit","Phat","Fab","Chill","Killer","Legit","Rad","Savage","Wicked","Alright","Excellent","Fab","Fantabulous","First-class","First-rate","Grand","Hot","Heavenly","Keen","Out-of-Sight","Peachy","Phat","Radical","Righteous","Stellar","Stupendous","Top-notch","A-Okay","Dynamite","Hip","Groovy","Neat","Neato","Nifty","Peachy Keen","That's Swell","That's Hot","Totally","Fresh","Delightful","Grand","Lovely","Outstanding","Sensational","Splendid","Superb","Wonderful","Oh Yeah","Yes"];
  let negative = ["Oof","Oh Noes","Awkward","Ouch","Yuck","Sad","Not Cool","Bogus","Bollucks","Boo","Brutal","Bunk","Bush League","Busted","Crummy","Fail","Hack","Janky","Janked Up","Weak","Whack","Jacked Up","Nope","Wrong","You Failed","You Salty?","You Suck","Sad","Rubbish","Garbage","What Are You Doing?","You Stink","Terrible","Awful","Yuck","Appalling","Atrocious","That's Tough","Ew","Gross","Bad","No","Not Even","Shocking","Tough","Oops","Err","Well Shucks","Whoopse","Whoops","Jeepers","Alas","Ow","Oh No","Egad","Golly","Huh","Ah Phooey","Ugh","Darn","Drat","Doggone","Dang","Cripes","Darnation","Gosh-darn-it","Blast","Well, Shoot"];
  // easy money win
  if (currentBet.species != null && currentBet.species == winner.constructor.name) {
    newPlayerMoney += currentBet.amount * 2;
    $("#greenAlert").html(choice(positive)+choice(punct)+" +$"+(currentBet.amount * 2));
    $("#greenAlert").show();
  // easy money lose
  } else if (currentBet.species != null && currentBet.species != winner.constructor.name) {
    newPlayerMoney -= currentBet.amount;
    $("#redAlert").html(choice(negative)+choice(punct)+" -$"+(currentBet.amount));
    $("#redAlert").show();
  // big money win
  } else if (currentBet.name != null && currentBet.name == winner.name) {
    newPlayerMoney += currentBet.amount * 5;
    $("#greenAlert").html(choice(positive)+choice(punct)+" +$"+(currentBet.amount * 5));
    $("#greenAlert").show();
  // big money lose
  } else if (currentBet.name != null && currentBet.name != winner.name) {
    newPlayerMoney -= currentBet.amount;
    $("#redAlert").html(choice(negative)+choice(punct)+" -$"+(currentBet.amount));
    $("#redAlert").show();
  }
    

  currentBet = { amount: 0, species: null, name: null };
}

function reset() {
  //let totalRacers = game.scoreboard.turtleCount + game.scoreboard.hareCount;
  ////cam.setParent(player, 600, 250);
  //cam.setParent(game.player, 160 + 5*totalRacers, 160 + 5*totalRacers);
  collapse1.classList.remove("show");
  collapse2.classList.remove("show");
  let smallScreenAdjustment = 0;
  if (width < 1200){
    smallScreenAdjustment = 800 - width;
  }else{
    smallScreenAdjustment = 0;
  }
  // cam.setParent(
  //   player,
  //   160 + 5*(game.turtleCount + game.hareCount) + Math.floor(smallScreenAdjustment * game.turtleCount * 0.125),
  //   160 + 5*(game.turtleCount + game.hareCount) + Math.floor(smallScreenAdjustment * game.turtleCount * 0.125)
  //              );
  // cam.setParent(
  //               player,
  //               170 + smallScreenAdjustment * 1,
  //               170 + smallScreenAdjustment * 1
  //              );
  //let objects = game.turtleArray.concat(game.hareArray);
  betPlaced = false;
  // player.newTransform.position.z = 450 - 55 * hareCount
  // player.newTransform.position.x = 0;
  // setTimeout(function(){
  //   gameState = "ingame";
  //   $("#greenAlert").hide();
  //   $("#redAlert").hide();
  // },3000);
}

  function userCompare( a, b ) {
    if ( a.money < b.money ){
      return 1;
    }
    if ( a.money > b.money ){
      return -1;
    }
    return 0;
  }

function writeLeaderboard() {
  leaderboardDiv.innerHTML = "";
  let text = "LEADERBOARD<br>"+width+"<br>";
  
  let leaders = []
  //console.log(game.leaderboard)
  if(game.leaderboard.length > 0){
    for(let each of game.leaderboard) {
    leaders.push({name:each.name,money:each.money});
  }

  leaders.sort( userCompare );
  
  let j = 1;
  for (let each of leaders){
    
    if(each != undefined){
      //console.log(each)
      text += j + ". " +
      each.name +
      ": $" +
      each.money +
      "<br>";
      j++;
    }
    
  }
  
  

  leaderboardDiv.innerHTML = text;
  }
  
}

function writeScoreboard() {
  scoreboardDiv.innerHTML = "";
  let text = "";

  text +=
    game.scoreboard.turtleHeading.name +
    ": " +
    game.scoreboard.turtleHeading.wins +
    "<br>";
  for (let each of game.scoreboard.turtleRacers){
    text +=
        each.name + ": " + each.wins + "<br>";
  }
  text += "<br>"
  text +=
    game.scoreboard.hareHeading.name + ": " + game.scoreboard.hareHeading.wins + "<br>";

  for (let each of game.scoreboard.hareRacers){
    text +=
        each.name + ": " + each.wins + "<br>";
  }

  scoreboardDiv.innerHTML = text;
}

function createHUD() {
  scoreboardDiv.innerHTML = "Score: <span id='scoreDiv'>0</span> / 100"; // Insert text
  scoreboardDiv.className = "hud mt-5 pt-3";
  scoreboardDiv.style.position = "absolute";
  scoreboardDiv.style.top = 0;
  scoreboardDiv.style.left = 0;
  document.body.appendChild(scoreboardDiv); // Append <div> to <body>
  moneyDisplay1.innerHTML =
    "💰 Your Money: <span id='pMoneySpan'>$" + playerMoney + "</span>";
  // moneyDisplay1.className = "text-right ";
  // moneyDisplay1.style.position = "absolute";
  // moneyDisplay1.style.top = 0;
  // moneyDisplay1.style.right = 0;
  // document.body.appendChild(moneyDisplay1); // Append <div> to <body>
  //scoreDisplay = document.getElementById("scoreDiv");
  playerMoneySpan = document.getElementById("pMoneySpan");
  leaderboardDiv.innerHTML = "LEADERBOARD"; // Insert text
  leaderboardDiv.className = "hud mt-5 pt-3";
  leaderboardDiv.style.position = "absolute";
  leaderboardDiv.style.top = 0;
  leaderboardDiv.style.right = 0;
  document.body.appendChild(leaderboardDiv); // Append <div> to <body>
}

function drawBoxes() {
  // let boxSize = ??
  // for loop
  push();
  translate(600, 5, 50);
  fill("red");
  rotateY(frameCount);
  noStroke();
  box(10);
  pop();
  push();
  translate(100, 5, 800);
  fill("blue");
  rotateY(frameCount);
  noStroke();
  box(10);
  pop();
}

function drawFloor() {
  push();
  //translate(-500,-2,500);
  translate(0,-2,0);
  strokeWeight(10);
  stroke(220);
  fill(floorColor);
  //box(1000,1,1000);
  box(2000,1,2000);
  pop();
  let tileSize = 100;
  // tile floor
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      push();
      translate(
        row * tileSize + tileSize / 2,
        0,
        col * tileSize + tileSize / 2
      );
      //fill(255);
      fill(floorColor);
      strokeWeight(10);
      stroke(220);
      box(tileSize, 1, tileSize);
      pop();
    }
  }
}
function drawText(mytext = "", color = "#ED225D", size = 36) {
  push();
  scale(1, -1, 1);
  textAlign(CENTER);
  fill(color);
  stroke(0);
  textFont(myFont);
  textSize(size);
  text(mytext, 0, 0);
  pop();
}

$(function() {
  $("#bettingModal").modal("hide");
});

$("#bettingModal").on("hide.bs.modal", function(e) {
  // do something...
  //gameState = "ingame";
  betPlaced = true;
});

function betEasy(species = null) {
  currentBet = { amount: parseInt(playerWager1.value), species: species, name: null};
  //gameState = "ingame";
  betPlaced = true;
  $("#bettingModal").modal("hide");
  socket.emit('betEasy', currentBet);
}
function betBig() {
  currentBet = { amount: parseInt(playerWager2.value), species: null, name: racerSelect.value};
  //gameState = "ingame";
  betPlaced = true;
  $("#bettingModal").modal("hide");
  socket.emit('betBig', currentBet);
}

$("#bettingModal").modal("hide");
//$("#bettingModal").modal("hide");
//$("#bettingModal").modal("hide");
$("#greenAlert").hide();
$("#redAlert").hide();

$("#greenAlert").on('click', function () {
    $('#greenAlert').hide();
});
$("#redAlert").on('click', function () {
    $('#redAlert').hide();
});

function hostStartGame(){
  console.log('host start game')
  socket.emit('host start game');
  $("#hostModal").modal("hide");
}

function showTurtle(obj){
    push();
    
    noStroke();
    translate(obj.x-24, 10, obj.z);
    rotateY(-obj.direction);
    scale(0.5,0.5,0.5);
    // name
    push()
    translate(0, 75, 0);
    rotateY(game.player.transform.rotation.y)
    rotateX(45)
    
    //drawText(obj.name,color(obj.energy*250,150,250),36);
    if(obj.winner){
      drawText(obj.name,color(random(100,255),random(100,255),random(100,255)),46);
    }else{
      drawText(obj.name,color(obj.textColor.r,obj.textColor.g,obj.textColor.b),36);
    }
    pop()
    //body
    push()
    if(obj.winner){
      rotateY(frameCount*2)
    }
    push();
    
    //texture(shell);
    stroke(90)
    //stroke(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b)
    shininess(10)
    ambientMaterial(obj.shellColor.r,obj.shellColor.g,obj.shellColor.b);
    
    translate(0, 15, 0);
    ellipsoid(40, 20, 30,6,3);
    //ellipsoid(30, 40, 40, 6, 3);
    pop();
    //head
    //texture(green);
    ambientMaterial(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b);
    push();
    translate(35, 20, 0);
    ellipsoid(15, 10, 15);
    pop();
    //legs
    push();
    
    let legMoveDist = 10;
    translate(-15, 0+sin(frameCount*3+90)*legMoveDist, 15);
    ambientMaterial(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b);
    box(10, 15, 10);
    pop();
    push();
    translate(15, 0+sin(frameCount*3)*legMoveDist, 15);
    ambientMaterial(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b);
    box(10, 15, 10);
    pop();
    push();
    translate(-15, 0+sin(frameCount*3+180)*legMoveDist, -15);
    ambientMaterial(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b);
    box(10, 15, 10);
    pop();
    push();
    translate(15, 0+sin(frameCount*3+270)*legMoveDist, -15);
    ambientMaterial(obj.bodyColor.r,obj.bodyColor.g,obj.bodyColor.b);
    box(10, 15, 10);
    pop();
    pop();
    pop()
}

function showHare(obj){
    push()
    translate(obj.x-18, 10, obj.z );
    scale(2,2,2)
    
    rotateY(-obj.transform.rotation.y); // test out different values to see what make the rabbits walk the correct direction. For example, maybe 90 or -90
    // name
    push()
    translate(0, 18, 0);
    rotateY(game.player.transform.rotation.y)
    rotateX(45)
    
    //drawText(obj.name,color(obj.energy*250,150,250),9);
    if(obj.winner){
      drawText(obj.name,color(random(100,255),random(100,255),random(100,255)),12);
    }else{
      drawText(obj.name,color(obj.textColor.r,obj.textColor.g,obj.textColor.b),9);
    }
    
    pop()
    push()
    if(obj.winner){
      rotateY(frameCount*2)
    }
    
    //left leg
    push();
    noStroke();
    //fill("grey");
    fill(obj.darkColor)
    if (obj.state == "standing") {
      translate(-3, 0, -2);
    }
    if (obj.state == "walking") {
      translate(-3, 2 + cos(frameCount * 5) * 3, -2);
      //rotateX(2 + sin(frameCount * 5) * 40);
    }
    box(3, 1, 1);
    pop();
    //right leg
    push();
    noStroke();
    //fill("grey");
    fill(obj.darkColor)
    if (obj.state == "standing") {
      translate(-3, 0, 2);
    }
    if (obj.state == "walking") {
      translate(-3, 2 + cos(frameCount * 5) * 3, 2);
      //rotateX(2 + cos(frameCount * 5) * 40);
    }
    box(3, 1, 1);
    pop();
    //body
    push();
    noStroke();
    translate(0, 5, 0);
    //texture(Bfur);
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    rotateZ(90);
    sphere(4.5, 8);
    pop();
    //left arm
    push();
    noStroke();
    //fill("grey");
    fill(obj.darkColor);
    if (obj.state == "standing") {
      translate(4, 0, -2);
    }
    if (obj.state == "walking") {
      translate(4, 2 + sin(frameCount * 5) * 3, -2);
      //rotateX(2 + cos(frameCount * 5) * 40);
    }
    box(3, 1, 1);
    pop();
    //right arm
    push();
    noStroke();
    //fill("grey");
    fill(obj.darkColor);
    if (obj.state == "standing") {
      translate(4, 0, 2);
    }
    if (obj.state == "walking") {
      translate(4, 2+sin(frameCount * 5) * 3, 2);
      //rotateX(2 + sin(frameCount * 5) * 40);
    }
    box(3, 1, 1);
    pop();
    //head
    push();
    noStroke();
    //texture(Bfur);
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    translate(5, 10, 0);
    //rotateY(-90);
    sphere(4);
    pop();
    //tail
    push();
    noStroke();
    //texture(Bfur);
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    translate(-5, 4, 0);
    sphere(2);
    pop();
    //left ear
    push();
    noStroke();
    //texture(Bfur);
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    translate(5, 15, -2.5);
    //rotateX(5);
    //box(1, 7, 2);
    ellipsoid(0.5,3.5,1)
    pop();
    //right ear
    push();
    noStroke();
    //texture(Bfur);
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    translate(5, 15, 2.5);
    //rotateX(-5);
    //box(1, 7, 2);
    ellipsoid(0.5,3.5,1)
    pop();
    //left eye
    push();
    noStroke();
    fill(obj.darkColor);
    translate(8, 12, -1);
    sphere(0.5);
    pop();
    //right eye
    push();
    noStroke();
    fill(obj.darkColor);
    translate(8, 12, 1);
    sphere(0.5);
    pop();
    //mouth
    push();
    noStroke();
    fill(obj.lightColor.r,obj.lightColor.g,obj.lightColor.b);
    translate(8.35, 10, 0);
    sphere(1);
    pop();
    pop();
    pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}