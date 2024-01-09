var caiosVec = [];
var backgroundColor;

var DEFAULT_MAXCAIONUM = 0;
var caiosCount = 0;
var framesCounter = 0;
var changingNavFonts = false;

var navCaioElementControl = null
var divCountElementControl = null;
var cTab = null;
var aTab = null;
var iTab = null;
var oTab = null;

var targetFrameRate = null;

function setup() {  
  angleMode(DEGREES);
  backgroundColor = color(200, 200, 210);
  createCanvas(windowWidth, windowHeight, WEBGL);
  DEFAULT_MAXCAIONUM = windowWidth / 7; 
  
  selectedElement = select('#c');
  selectedElement.mouseOver(openCaioCTab);
  //selectedElement.mouseClicked(closeCaioCTab);
  selectedElement.touchStarted(openCaioCTab);
  
  selectedElement = select('#a');
  selectedElement.mouseOver(openCaioATab);
  //selectedElement.mouseClicked(closeCaioATab);
  selectedElement.touchStarted(openCaioATab);
  
  selectedElement = select('#i');
  selectedElement.mouseOver(openCaioITab);
  //selectedElement.mouseClicked(closeCaioITab);
  selectedElement.touchStarted(openCaioITab);
  
  selectedElement = select('#o');
  selectedElement.mouseOver(openCaioOTab);
  //selectedElement.mouseClicked(closeCaioOTab);
  selectedElement.touchStarted(openCaioOTab);
  
  navCaioElementControl = new ElementControl('#navCAIO');
  divCountElementControl = new ElementControl('#caiosCountDiv');
  cTab = new ElementControl('#cTab');
  aTab = new ElementControl('#aTab');
  iTab = new ElementControl('#iTab');
  oTab = new ElementControl('#oTab');
 
  selectedElement = select('canvas');
  selectedElement.mouseClicked(closeCaioTabs);
  selectedElement.touchStarted(closeCaioTabs);
  
  frameRate(60);
  targetFrameRate = 60;
  
}

function update(){
  if(caiosVec.length < DEFAULT_MAXCAIONUM){
    let caio = new Caio(new Point(random(-windowWidth / 3, windowWidth + (windowWidth / 3)), random(-windowHeight + (2*DEFAULT_MAXZ), -windowHeight), random(DEFAULT_MAXZ, -DEFAULT_MAXZ/2)), new Color(random(-15, 30), random(-15, 30), random(-15, 30)), true);
    caio.speed.y = random(5, 6.5);
    caio.acceleration.y = random(1, 5) * 0.0035;
    caiosVec.push(caio);
  }
  
  for(let i = 0; i < caiosVec.length; i++){
    caiosVec[i].updateCaio();
    
    if(caiosVec[i].position.y - abs(caiosVec[i].position.z) > windowHeight){
      caiosVec.splice(i, 1);
      caiosCount++;
      select('#caiosCount').html(caiosCount);
    }
  }
  if(changingNavFonts == true){
    updateNavFonts();
  }
  
  if(framesCounter < int(targetFrameRate*8) + 1){
    
    if(framesCounter == 60){
      divCountElementControl.startOpacityChange(80, int(targetFrameRate));
    }
    
    if(framesCounter == int(targetFrameRate*4)){
      navCaioElementControl.startOpacityChange(80, int(targetFrameRate*4));
    }
    framesCounter++;
    
    if(framesCounter == int(targetFrameRate*4.5)){
      changingNavFonts = true;
    }
  }
  
  navCaioElementControl.update();
  divCountElementControl.update();
  cTab.update();
  aTab.update();
  iTab.update();
  oTab.update();
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
  cTab.startOpacityChange(100, targetFrameRate*0.5, 'inline-block');
}

function openCaioATab(){
  aTab.startOpacityChange(100, targetFrameRate*0.5, 'inline-block');
}

function openCaioITab(){
  iTab.startOpacityChange(100, targetFrameRate*0.5, 'inline-block');
}

function openCaioOTab(){
  oTab.startOpacityChange(100, targetFrameRate*0.5, 'inline-block');
}

function closeCaioCTab(){
    cTab.startOpacityChange(0, targetFrameRate*0.5, 'inline-block');
}

function closeCaioATab(){
    aTab.startOpacityChange(0, targetFrameRate*0.5, 'inline-block');
}

function closeCaioITab(){
    iTab.startOpacityChange(0, targetFrameRate*0.5, 'inline-block');
}

function closeCaioOTab(){
    oTab.startOpacityChange(0, targetFrameRate*0.5, 'inline-block');
}

function closeCaioTabs(){
  cTab.startOpacityChange(0, targetFrameRate*1, 'inline-block');
  aTab.startOpacityChange(0, targetFrameRate*1, 'inline-block');
  iTab.startOpacityChange(0, targetFrameRate*1, 'inline-block');
  oTab.startOpacityChange(0, targetFrameRate*1, 'inline-block');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
