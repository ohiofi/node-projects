// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const bodyparser = require('simple-bodyparser');


// init dotArray 
var dotArray = require('./example.json');
//console.log(typeof dotArray);
//dotArray = JSON.stringify(dotArray);

// arrays equal
  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    //if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (!isEquivalent(a[i],b[i])) return false;
    }
    return true;
  }
  function isEquivalent(a, b) {
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
      // if (aProps.length != bProps.length) {
      //     return false;
      // }
      for (var i = 0; i < aProps.length; i++) {
          var propName = aProps[i];
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
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(isEquivalent(a[i],a[j]))
                a.splice(j--, 1);
        }
    }
    return a;
};


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));
app.use(express.static('node_modules/p5/lib'));
app.use(express.static('node_modules/p5/lib/addons'));
app.use(bodyparser());


// Do this when page first loads or when ajax polling
app.get('/game-data', function(request,response){
  response.send(dotArray);
});


// When a form posts... do this stuff
app.post('/', function(request, response) {
  console.log("new form post");
  //console.log(request.body);
  let newData = JSON.parse(request.body);
  console.log(newData);
  console.log(newData == "reset");
  
  //console.log(typeof newData);
  //console.log(typeof request.body);
  //console.log(request.body.toLowerCase().slice(1, -1));
  //if (request.body.toLowerCase().slice(1, -1) != "reset"){
  //let prevData = dotArray;
  // if (newData.length <= dotArray.length){
  //   //console.log(dotArray);
  //   dotArray = newData;
  // }else if(newData.length > dotArray.length){
  //   //dotArray = dotArray.concat(newData).unique();
  //   dotArray = dotArray.slice(
  // }
  //response.redirect('back'); 
  if(dotArray.length > 10000){
    dotArray.length=0;
  }
  if(newData == "reset"){
    if(dotArray.length > 50){
      dotArray.length=0; 
    }else{
      //do nothin  
    }
//     dotArray.length=0; 
//     // for(var i=dotArray.length-1;i>=0;i--){
//     //   dotArray.pop(i);
//     // }
    
  }else{
    dotArray = dotArray.concat(newData);
  }
  
  response.send(dotArray);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
