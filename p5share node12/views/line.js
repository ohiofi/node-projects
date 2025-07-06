class Line{
  constructor(pointArray){
    this.time = null; // this.time is set by the node.js server
    this.username = name;
    this.color
    this.points = pointArray;
    this.boundary = {
      x:Math.min.apply(null, pointArray),// how to calculate min x given array of xy objects?
      y:Math.max.apply(null, pointArray),
      w:0,
      h:0
    }
  }
}