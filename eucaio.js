var caiosVec = [];
var backgroundColor;

var DEFAULT_MAXCAIONUM = 0;
var framesCounter = 0;
var changingNavFonts = false;

function setup() {  
  angleMode(DEGREES);
  backgroundColor = color(200, 200, 210);
  createCanvas(windowWidth, windowHeight, WEBGL);
  DEFAULT_MAXCAIONUM = windowWidth / 7; 
  
  selectedElement = select('#c');
  selectedElement.mouseOver(openCaioCTab);
  selectedElement.mouseOut(closeCaioCTab);
  selectedElement.touchStarted(openCaioCTab);
  selectedElement.touchEnded(closeCaioCTab);
  
  selectedElement = select('#a');
  selectedElement.mouseOver(openCaioATab);
  selectedElement.mouseOut(closeCaioATab);
  selectedElement.touchStarted(openCaioATab);
  selectedElement.touchEnded(closeCaioATab);
  
  selectedElement = select('#i');
  selectedElement.mouseOver(openCaioITab);
  selectedElement.mouseOut(closeCaioITab);
  selectedElement.touchStarted(openCaioITab);
  selectedElement.touchEnded(closeCaioITab);
  
  selectedElement = select('#o');
  selectedElement.mouseOver(openCaioOTab);
  selectedElement.mouseOut(closeCaioOTab);
  selectedElement.touchStarted(openCaioOTab);
  selectedElement.touchEnded(closeCaioOTab);
}

function update(){
  if(caiosVec.length < DEFAULT_MAXCAIONUM){
    let caio = new Caio(new Point(random(-windowWidth / 3, windowWidth + (windowWidth / 3)), random(-windowHeight + DEFAULT_MAXZ, -windowHeight), random(DEFAULT_MAXZ, -DEFAULT_MAXZ/2)), new Color(random(-15, 30), random(-15, 30), random(-15, 30)), true);
    caio.speed.y = random(5, 6.5);
    caio.acceleration.y = random(1, 5) * 0.0035;
    caiosVec.push(caio);
  }
  
  for(let i = 0; i < caiosVec.length; i++){
    caiosVec[i].updateCaio();
    
    if(caiosVec[i].position.y - abs(caiosVec[i].position.z) > windowHeight){
      caiosVec.splice(i, 1);
    }
  }

  if(changingNavFonts == true){
    updateNavFonts();
  }
  
  if(framesCounter < 481){
    if(framesCounter > 240){
      selectedElement = select('#navCAIO');
      selectedElement.style('opacity', float(((framesCounter-240.0)/240.0)) * 80 + '%');
    }
    framesCounter++;
    
    if(framesCounter == 280){
      changingNavFonts = true;
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

var changeFontChance = 0.98;
var chanceChange = - 0.001;

function updateNavFonts(){
  let selectedElement = null;
  let fontChanged = false;
  
  if(random(0, 1.001) > changeFontChance){
    let randomFont = int(random(0, fontFamiliesVec.length));
    selectedElement = select('#c');
    selectedElement.style(fontFamiliesVec[randomFont]);
    fontChanged = true;
  }
  
  if(random(0, 1.001) > changeFontChance){
    let randomFont = int(random(0, fontFamiliesVec.length));
    selectedElement = select('#a');
    selectedElement.style(fontFamiliesVec[randomFont]);
    fontChanged = true;
  }
  
  if(random(0, 1.001) > changeFontChance){
    let randomFont = int(random(0, fontFamiliesVec.length));
    selectedElement = select('#i');
    selectedElement.style(fontFamiliesVec[randomFont]);
    fontChanged = true;
  }
  
  if(random(0, 1.001) > changeFontChance){
    let randomFont = int(random(0, fontFamiliesVec.length));
    selectedElement = select('#o');
    selectedElement.style(fontFamiliesVec[randomFont]);
    fontChanged = true;
  }
  
  if(fontChanged){
    changeFontChance = changeFontChance + chanceChange;
    
    if(changeFontChance < 0.825 || changeFontChance > 0.98){
      chanceChange = chanceChange * -1;
    }
  }
}

function openCaioCTab(){
  selectedElement = select('#cTab');
  selectedElement.style('display: inline-block');
  selectedElement.style('opacity: 100%');
}

function openCaioATab(){
  selectedElement = select('#aTab');
  selectedElement.style('display: inline-block');
  selectedElement.style('opacity: 100%');
}

function openCaioITab(){
  selectedElement = select('#iTab');
  selectedElement.style('display: inline-block');
  selectedElement.style('opacity: 100%');
}

function openCaioOTab(){
  selectedElement = select('#oTab');
  selectedElement.style('display: inline-block');
  selectedElement.style('opacity: 100%');
}

function closeCaioCTab(){
  selectedElement = select('#cTab');
  selectedElement.style('display: none');
  selectedElement.style('opacity: 0%');
}

function closeCaioATab(){
  selectedElement = select('#aTab');
  selectedElement.style('display: none');
  selectedElement.style('opacity: 0%');
}

function closeCaioITab(){
  selectedElement = select('#iTab');
  selectedElement.style('display: none');
  selectedElement.style('opacity: 0%');
}

function closeCaioOTab(){
  selectedElement = select('#oTab');
  selectedElement.style('display: none');
  selectedElement.style('opacity: 0%');
}
