var caiosVec = [];
var backgroundColor;

var DEFAULT_MAXCAIONUM = 0;

function setup() {
  print(caiosVec);
  
  angleMode(DEGREES);
  backgroundColor = color(200, 200, 210);
  createCanvas(displayWidth, displayHeight, WEBGL);
  DEFAULT_MAXCAIONUM = displayWidth / 6; 
}

function update(){
  if(caiosVec.length < DEFAULT_MAXCAIONUM){
    let caio = new Caio(new Point(random(-windowWidth / 3, windowWidth + (windowWidth / 3)), random(-displayHeight + DEFAULT_MAXZ, -displayHeight), random(DEFAULT_MAXZ, -DEFAULT_MAXZ/2)), new Color(random(-15, 30), random(-15, 30), random(-15, 30)), true);
    caio.speed.y = random(5, 6.5);
    caio.acceleration.y = random(1, 5) * 0.0035;
    caiosVec.push(caio);
  }
  
  for(let i = 0; i < caiosVec.length; i++){
    caiosVec[i].updateCaio();
    
    if(caiosVec[i].position.y - abs(caiosVec[i].position.z) > displayHeight){
      caiosVec.splice(i, 1);
    }
  }
}

function draw() {
  translate(-windowWidth/2, -windowHeight/2);
  update();
  
  background(backgroundColor);
  
  for (let index = 0; index < caiosVec.length; index++){
    caiosVec[index].drawCaio();
  }
}
