/*global abs,angleMode,append,background,beginShape,bezier,box,camera,ceil,CENTER,color,cone,cos,createCanvas,createCanvas,createGraphics,curveVertex,cylinder,DEGREES,displayHeight,displayWidth,dist,div,DOWN_ARROW,ellipse,endShape,fill,floor,frameCount,frameRate,height,image,key,keyCode,keyIsDown,keyIsPressed,keyIsPressed,keyPressed,LEFT,LEFT_ARROW,lerpColor,line,loadImage,loadJSON,loadSound,map,mouseIsPressed,mouseX,mouseY,noFill,noLoop,normalMaterial,noStroke,p5,plane,point,pointLight,pop,push,push,RADIANS,radians,random,rect,resizeCanvas,resizeCanvas,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,rotateZ,round,round,scale,shuffle,sin,sphere,stroke,strokeWeight,text,textAlign,textFont,textSize,texture,textWidth,torus,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowHeight,windowWidth,world */

let pollInterval = 2000;
let gameData = [];
let newServerData = [];
let newLocalData = [];
let colorInput = document.getElementById("userColor");
let penColor = colorInput.value;
let paintbg = false;
let lastDot;
let e = 1000;

// when user changes colorInput, update penColor
colorInput.addEventListener("input", function() {
  penColor = colorInput.value;
}, false);

function randomUsername() {
  let letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let name = "";
  for (let i = 0; i < 7; i++) {
    name += letters[Math.floor(Math.random() * letters.length)];
  }
  return name;
}

function getRandomColor() {
  let letters = '00000111122233456789abccdddeeeefffff';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function setPenRandom(){
  colorInput.value = getRandomColor();
  penColor = colorInput.value;
  blackDot();
}

function blackDot(){
  newLocalData.push(
      {x:-999,y:-999,color:"#000000"}
    );
}

setPenRandom();



// P5 code
/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse */
//let pencolor = document.getElementById("userColor").value;
function setup() {
  //let myCanvas = createCanvas(windowWidth-20,windowHeight-20);
  let myCanvas = createCanvas(windowWidth,windowHeight);

  myCanvas.parent("canvasContainer");
  noStroke();
  lastDot = {x:-999,y:-999,color:"#000000"};
}

function draw() {
  if(newServerData.length>0){
    newServerData.reverse();
  }
  for (let i=newServerData.length-1;i>=0;i--){
    if(newServerData[i].color == lastDot.color){
      strokeWeight(7);
      stroke(newServerData[i].color);
      line(lastDot.x,lastDot.y,newServerData[i].x, newServerData[i].y);
    }
    fill(newServerData[i].color);
    noStroke();
    ellipse(newServerData[i].x, newServerData[i].y, 7, 7);
    lastDot = newServerData[i];
    gameData.push(newServerData.pop());

  }
  if (mouseIsPressed && mouseY>0) {
    if (newLocalData.length > 0)
      lastDot = newLocalData[newLocalData.length-1];
    newLocalData.push(
      {color: penColor.toString(), x: mouseX, y: mouseY}
    );
    if(newLocalData[newLocalData.length-1].color == lastDot.color){
      strokeWeight(7);
      stroke(newLocalData[newLocalData.length-1].color);
      line(lastDot.x,lastDot.y,newLocalData[newLocalData.length-1].x, newLocalData[newLocalData.length-1].y);
    }
    fill(penColor);
    noStroke();
    ellipse(mouseX, mouseY, 7, 7);
  } else{
    lastDot = {x:-999,y:-999,color:"#000000"};
  }
  if (paintbg){
    background("white");
    paintbg = false;
  }
}




// server stuff

//get our game data from the server

// first we create a function to call when we request and get data
const gameRequestListener = function() {
  // 5. set our status to yes or no based on if there are updates for  each day so far
  newServerData = JSON.parse(this.responseText);
  console.log(gameData);
}

// then we make a request to our server for the data. when successful, the
// above gameRequestListener will be called!
const gameRequest = new XMLHttpRequest();
gameRequest.addEventListener('load', gameRequestListener);
gameRequest.open('get', '/game-data', true);
gameRequest.send();


function isEquivalent(a, b) {
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  // if (aProps.length != bProps.length) {
  //     return false;
  // }
  for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      if (a[propName] !== b[propName]) {
        // console.log("fail");
        // console.log(a[propName]);
        // console.log(b[propName]);
          return false;
      }
  }
  return true;
}
Array.prototype.unique = function() {
    let a = this.concat();
    for(let i=0; i<a.length; ++i) {
        for(let j=i+1; j<a.length; ++j) {
            if(isEquivalent(a[i],a[j]))
                a.splice(j--, 1);
        }
    }
    return a;
};
function mouseUp(){
  newLocalData.push(
      {x:-999,y:-999,color:"#000000"}
    );
  newLocalData=newLocalData.unique();
  $.ajax({
        type: 'POST',
        data: JSON.stringify(newLocalData),
        contentType: 'application/json',
        url: '/',						
        success: function(responseText) {
          console.log('ajax post success');
          console.log(responseText);
          //gameData = JSON.parse(responseText);
          newServerData = responseText.slice(gameData.length);
          newLocalData.length = 0;
        }
  });
}
function whiteout(){
  document.getElementById("ebutton").style.display="none";
  document.getElementById("obutton").style.display="block";
  setTimeout(showe,e);
  gameData.length=0;
  // for(let i=gameData.length-1;i>=0;i--){
  //   gameData.pop(i);
  // }
  paintbg = true;
  newLocalData.push(
      {x:-999,y:-999,color:"#000000"}
    );
  $.ajax({
        type: 'POST',
        data: JSON.stringify("reset"),
        contentType: 'application/json',
        url: '/',						
        success: function(responseText) {
          console.log('whitout success');
          console.log(responseText);
          //gameData = JSON.parse(responseText);
          newServerData = responseText.slice(gameData.length);
        }
  });
}
function showe() {
  document.getElementById("obutton").style.display="none";
  document.getElementById("ebutton").style.display="block";
}
function oof(){e+=e;if(e>8000)alert("🛑✋👮🚦🚸⛔")}



// ajax polling 
$(function poll() {
setTimeout(function() {
  if(mouseIsPressed){
    setTimeout(poll,pollInterval);
    return;
  }
  console.log("polling");
    $.ajax({
        url: "/game-data",
        type: "GET",
        success: function(responseText) {
          // console.log("polling success");
          console.log(responseText);
          console.log(gameData);
          // console.log(arraysEqual(responseText,gameData));
          if (responseText.length == gameData.length) {
            console.log("no polling update");
          } else if(responseText.length < gameData.length){
            gameData.length=0;
            newLocalData.length=0;
            // for(let i=gameData.length-1;i>=0;i--){
            //   gameData.pop(i);
            // }
            paintbg = true;
          } else {
            console.log("YES polling update");
            newServerData = responseText.slice(gameData.length);
          }
        },
        dataType: "json",
        complete: poll,
        timeout: pollInterval*0.9
    })
}, pollInterval);
});


// arrays equal
// function arraysEqual(a, b) {
//   if (a === b) return true;
//   if (a == null || b == null) return false;
//   if (a.length != b.length) return false;
//   for (let i = 0; i < a.length; ++i) {
//     if (!isEquivalent(a[i],b[i])) return false;
//   }
//   return true;
// }
// function isEquivalent(a, b) {
//     let aProps = Object.getOwnPropertyNames(a);
//     let bProps = Object.getOwnPropertyNames(b);
//     // if (aProps.length != bProps.length) {
//     //     return false;
//     // }
//     for (let i = 0; i < aProps.length; i++) {
//         let propName = aProps[i];
//         if (a[propName] !== b[propName]) {
//           console.log("fail");
//           console.log(a[propName]);
//           console.log(b[propName]);
//             return false;
//         }
//     }
//     return true;
// }