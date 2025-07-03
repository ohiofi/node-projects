/*global shininess,ambientMaterial,Camera,texture,ellipsoid,ambientLight,directionalLight,createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/





module.exports = class Turtle {
  static test="123";
  static turtleNames = [
  "Shelly",
  "Jon",
  "Shelby",
  "Sandy",
  "Sandra",
  "Karen",
  "Shahad",
  "Max",
  "Amanda",
  "Snappy",
  "Teen",
  "Mutant",
  "Ninja",
  "Sis",
  "Smash",
  "Don",
  "Leo",
  "Mike",
  "Raph",
  "Tubby",
  "Sue",
  "Taz",
  "Tim",
  "Tia",
  "Sal",
  "Ted",
  "Terra",
  "Greene",
  "Pond",
  "Lake",
  "Tort",
  "Tart",
  "Splash",
  "Eggy",
  "Squirt",
  "Smith",
  "Smarth",
  "Smooth",
  "Truman",
  "Sminkin",
  "Sewer",
  "Syd",
  "Seward",
  "Teddy",
  "Slimey",
  "Torty",
  "Taco",
  "Tara",
  "Slimer",
  "Sushi",
  "Sid",
  "Sam",
  "Seth",
  "Sara",
  "Sassy",
  "Susan",
  "Stu",
  "Sadie",
  "Stella",
  "Sage",
  "Sasha",
  "Sierra",
  "Skylar",
  "Steph",
  "Sydney",
  "Tracy",
  "Tony",
  "Tom",
  "Tracy",
  "Tina",
  "Thomas",
  "Toots",
  "Tops",
  "Theo",
  "Thor",
  "Tobias",
  "Treble",
  "Trouble",
  "Thad",
  "Ty"
];
  constructor(x,z,name) {
    this.class = "turtle"
    this.name = name;
    this.x = x;
    this.z = z;
    this.speed = (Math.random()+Math.random()+0.5) * 0.75;
    this.direction = 0;
    this.bodyColor = {r:0,g:Math.round(Math.random()*105)+150,b:0};
    this.shellColor = {r:Math.round(Math.random()*60)+190,g:Math.round(Math.random()*60)+170,b:Math.round(Math.random()*60)+130};
    this.energy = (Math.random()*1.5+1)*0.5;
    this.secondWind = Math.random()*0.5+Math.random()*0.5
    this.winner = false;
    this.textColor = {
                      r:20+Math.round(Math.random()*60)-20,
                      g:70+Math.round(Math.random()*60)-30,
                      b:20+Math.round(Math.random()*60)-20
                      // r:30+Math.round(Math.random()*60)-30,
                      // g:140+Math.round(Math.random()*60)-30,
                      // b:30+Math.round(Math.random()*60)-30
                     };
  }
  
  update() {
    // delayed start
    if(this.x == 0 && Math.random()<0.8){
      return
    }
    this.energy *= 0.98;
    if(this.x > 500 && this.x < 550){
      this.energy = (Math.random()*0.25+Math.random()*0.25+Math.random()*0.25+Math.random()*0.25+this.secondWind) * 0.75;
    }
    this.x = this.x + Math.cos(this.direction) * (this.speed+this.energy);
  }
}