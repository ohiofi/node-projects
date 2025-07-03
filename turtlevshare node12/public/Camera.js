/*global movedY,createCamera,GameObject,abs,updateCamera,checkPlayerControls,requestPointerLock,scale,loadFont,setAttributes,PI,round,camera,sphere,torus,cone,cylinder,plane,rotateX,rotateY,rotateZ,frameCount,normalMaterial,translate,angleMode,background,beginShape,box,CENTER,color,cos,createCanvas,curveVertex,DEGREES,displayHeight,displayWidth,dist,DOWN_ARROW,ellipse,endShape,fill,floor,frameRate,height,image,keyCode,keyIsDown,LEFT,LEFT_ARROW,line,loadImage,loadSound,mouseIsPressed,mouseX,mouseY,noFill,noStroke,p5,pointLight,pop,push,RADIANS,random,RIGHT,RIGHT_ARROW,rotate,rotateX,rotateY,shuffle,sin,stroke,strokeWeight,text,textAlign,textFont,textSize,translate,triangle,UP_ARROW,WEBGL,width,windowHeight,windowWidth*/

class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.target = { x: 0, y: 0, z: 0 };
    this.verticalTiltSpeed = 0.05;
    this.verticalTiltOffset = 0;
    this.hasParent = false;
    this.parentObjectObject = null;
    this.distanceBehindParent = 200;
    this.distanceAboveParent = 100;
  }
  update() {
    // tilt camera up/down (movedY is part of p5.js)
    // this.verticalTiltOffset -= movedY * this.verticalTiltSpeed;

    if (this.hasParent) {
      this.setPosition(
        this.parentObject.transform.position.x -
          this.distanceBehindParent *
            sin(this.parentObject.transform.rotation.y),
        this.distanceAboveParent,
        this.parentObject.transform.position.z -
          this.distanceBehindParent *
            cos(this.parentObject.transform.rotation.y)
      );
    }

    camera(
      this.x,
      this.y,
      this.z,
      this.target.x,
      this.target.y + this.verticalTiltOffset,
      this.target.z,
      0,
      -1,
      0
    );
  }
  lookAt(x, y, z) {
    this.target.x = x;
    this.target.y = y;
    this.target.z = z;
  }
  setParent(someGameObject, distanceAbove=100, distanceBehind=200, ) {
    this.target = someGameObject.transform.position;
    this.verticalTiltOffset = distanceAbove / 2;
    this.distanceBehindParent = distanceBehind;
    this.distanceAboveParent = distanceAbove;
    this.parentObject = someGameObject;
    this.hasParent = true;
  }
  setPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
