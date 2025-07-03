/*global PlayerObject,texture,createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/



module.exports = class Hare {
  static hareNames = [
  "Bops",
  "Ben",
  "Bonnie",
  "Barb",
  "Bub",
  "Brown",
  "Bart",
  "Bob",
  "Babs",
  "Bops",
  "Boo",
  "Baby",
  "Bess",
  "Bill",
  "Bell",
  "Beth",
  "Benji",
  "Betsy",
  "Boots",
  "Busy",
  "Buzz",
  "Bro",
  "Bessie",
  "Blue",
  "B.B.",
  "Blinky",
  "Bubbles",
  "Big",
  "Bert",
  "Bort",
  "Burt",
  "Becky",
  "Bam",
  "Bork",
  "Bee",
  "Bets",
  "Bus",
  "Beck",
  "Boone",
  "Barney",
  "Brite",
  "Bitey",
  "Bunny",
  "Bugs",
  "Buster",
  "Bix",
  "Barkley",
  "Bernie",
  "Brad",
  "Brony",
  "Bronson",
  "Boss",
  "Beans",
  "Buddy",
  "Berkley",
  "Buffy",
  "Bobby",
  "Biz",
  "Blaze",
  "Burke",
  "Bertha",
  "Benjamin",
  "Boy",
  "Boi",
  "Bb",
  "B#",
  "Bass",
  "Boolean",
  "Bully",
  "Bucko",
  "Bigboi",
  "Bullseye",
  "Bord",
  "Boids",
  "Bart",
  "Bard",
  "Bethany",
  "Birch",
  "Burger",
  "Batman",
  "Batgirl",
  "Bailey",
  "Barley",
  "Bread",
  "Break",
  "Broke",
  "Bentley",
  "Brock",
  "Barack",
  "Brunch",
  "Brah",
  "Bacon",
  "Baldy",
  "Book",
  "Baldy",
  "Bingus",
  "Bubba"
];
  constructor(_x, _z,name) {
    this.transform = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      }
    };
    this.class = "hare";
    this.name = name;
    this.x = _x;
    this.z = _z;
    this.transform.position.y = 0;
    this.transform.scale.x = Math.random()*0.3+1.6;
    this.transform.scale.y = Math.random()*0.3+1.6;
    this.transform.scale.z = Math.random()*0.3+1.6;
    this.state = "walking";
    this.transform.rotation.y = 0
    this.speed = (Math.random()*3 + Math.random()*3 + 1) * 0.65;
    let lightBase = Math.round(Math.random()*85);
    this.lightColor = {r:255-lightBase,g:255-lightBase*2,b:255-lightBase*3};
    this.darkColor = Math.round(Math.random()*50)+105;
    this.sleepTimer = Math.round(Math.random()*15)+15;
    this.awakeTimer = Math.round(Math.random()*15)+15+Math.round(Math.random()*15)+15;
    this.maxSleep = Math.round(Math.random()*20)+25+Math.round(Math.random()*20)+25;
    this.maxAwake = Math.round(Math.random()*5)+25+Math.round(Math.random()*5)+25;
    this.energy = 5;
    this.winner = false
    this.textColor = {r:140+Math.round(Math.random()*60)-30,g:30+Math.round(Math.random()*60)-30,b:30+Math.round(Math.random()*60)-30};
  }
  
  update() {
    // delayed start
    if(this.x == 0 && Math.random()<0.2){
      return
    }
    // awake
    if (this.awakeTimer < this.maxAwake) {
      this.state = "walking"
      this.energy *= 0.9;
      this.x  += Math.cos(this.transform.rotation.y) * (this.speed + this.energy);
      this.awakeTimer++;
    // sleep
    } else if (this.sleepTimer < this.maxSleep) {
      this.energy *= 0.85;
      this.state = "standing"
      this.sleepTimer ++;
    // wake up  
    } else {
      this.sleepTimer = 0;
      this.awakeTimer = 0;
      this.energy = (Math.random()*2 + 3) *0.75
    }
  }

}