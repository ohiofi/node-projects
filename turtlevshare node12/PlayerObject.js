/*global createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

module.exports = class GameObject {
  static positive = [
    "Nice",
    "Cool",
    "Good Job",
    "Sweet",
    "Well Done",
    "Neat",
    "Boss",
    "Fancy",
    "Dandy",
    "Devine",
    "Keen",
    "Swell",
    "Glorious",
    "Hunky-Dory",
    "Marvelous",
    "Nifty",
    "Sensational",
    "Noice",
    "Sick",
    "Gucci",
    "Lit",
    "Phat",
    "Fab",
    "Chill",
    "Killer",
    "Legit",
    "Rad",
    "Savage",
    "Wicked",
    "Alright",
    "Excellent",
    "Fab",
    "Fantabulous",
    "First-class",
    "First-rate",
    "Grand",
    "Hot",
    "Heavenly",
    "Keen",
    "Out-of-Sight",
    "Peachy",
    "Phat",
    "Radical",
    "Righteous",
    "Stellar",
    "Stupendous",
    "Top-notch",
    "A-Okay",
    "Dynamite",
    "Hip",
    "Groovy",
    "Neat",
    "Neato",
    "Nifty",
    "Peachy Keen",
    "That's Swell",
    "That's Hot",
    "Totally",
    "Fresh",
    "Delightful",
    "Grand",
    "Lovely",
    "Outstanding",
    "Sensational",
    "Splendid",
    "Superb",
    "Wonderful",
    "Oh Yeah",
    "Yes"
  ];
  static negative = [
    "Oof",
    "Awkward",
    "Ouch",
    "Yuck",
    "Sad",
    "Not Cool",
    "Bogus",
    "Bollucks",
    "Boo",
    "Brutal",
    "Bunk",
    "Bush League",
    "Busted",
    "Crummy",
    "Fail",
    "Hack",
    "Janky",
    "Janked Up",
    "Weak",
    "Whack",
    "Jacked Up",
    "Nope",
    "Wrong",
    "You Failed",
    "You Salty?",
    "You Stink",
    "Sad",
    "Rubbish",
    "Garbage",
    "What Are You Doing?",
    "You Stink",
    "Terrible",
    "Awful",
    "Yuck",
    "Appalling",
    "Atrocious",
    "That's Tough",
    "Ew",
    "Gross",
    "Bad",
    "No",
    "Not Even",
    "Shocking",
    "Tough",
    "Oops",
    "Err",
    "Well Shucks",
    "Whoopse",
    "Whoops",
    "Jeepers",
    "Alas",
    "Ow",
    "Oh No",
    "Egad",
    "Golly",
    "Huh",
    "Ah Phooey",
    "Ugh",
    "Darn",
    "Drat",
    "Doggone",
    "Dang",
    "Cripes",
    "Darnation",
    "Gosh-darn-it",
    "Blast",
    "Well, Shoot"
  ];
  constructor() {
    this.frameCount = 0;
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
    this.color = { r: 150, g: 150, b: 150 };
    this.outline = { r: 0, g: 0, b: 0 };
    this.newTransform = {
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
  }

  update() {
    this.frameCount += 0.01;
    // When you create subclasses from GameObject, you can move things, change velocities, apply gravity, change
    if (this.transform.position.x != this.newTransform.position.x){
      this.transform.position.x += (this.newTransform.position.x-this.transform.position.x)*0.03
    }
    if (this.transform.position.z != this.newTransform.position.z){
      this.transform.position.z += (this.newTransform.position.z-this.transform.position.z)*0.005
    }
    if (this.transform.rotation.y != this.newTransform.rotation.y){
      this.transform.rotation.y += (this.newTransform.rotation.y-this.transform.rotation.y)*0.03
    }
    this.newTransform.rotation.y = -20+Math.sin(this.frameCount * 0.05)*20
    //this.newTransform.rotation.y = 0 
  }
}
