var caiosVec = [];
var backgroundColor;

var DEFAULT_MAXCAIONUM = 0;
var caiosCount = 0;
var jumpStartAnimation = false;
var framesCounter = 0;
var changingNavFonts = false;
var drawSampleCaio = false;
var sampleCaioIndex = 0;
var widthTooShort = false;
var heightTooShort = false;
var curPage = null;

var navCaioElementControl = null
var divCountElementControl = null;
var cTab = null;
var aTab = null;
var iTab = null;
var oTab = null;
var caiosP = null;

var targetFrameRate = null

var currentCompType = 's';
var currentCompContentId = '#spanSoloContent';
var currentCompNamesId = '#spanSoloNames';

function preload(){
  caiosCount = window.location.hash.substring(1);
  
  if(caiosCount == '' || isNaN(caiosCount)){
      caiosCount = 0;
  }
  
  select('#caiosCount').html(caiosCount);
  
  var currentUrl = window.location.href;
  var pageName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
  pageName = pageName.split('#')[0];
  if(pageName == "comps.html" || pageName == "impros.html"){
    windowResized();
  }
  else if(pageName == "bio.html"){
    windowResized();
    changeHeadshot();
  }
  
  if(pageName != "index.html" && pageName != ""){
    jumpStartAnimation = true;
  }
  curPage = pageName;
}

function setup() {
  angleMode(DEGREES);
  backgroundColor = color(200, 200, 210);
  createCanvas(windowWidth, windowHeight, WEBGL);
  DEFAULT_MAXCAIONUM = windowWidth / 10; 
  
  selectedElement = select('#c');
  selectedElement.mouseOver(openCaioCTab);
  selectedElement.mouseClicked(closeCaioCTab);
  selectedElement.touchStarted(openCaioCTab);
  
  selectedElement = select('#a');
  selectedElement.mouseOver(openCaioATab);
  selectedElement.mouseClicked(closeCaioATab);
  selectedElement.touchStarted(openCaioATab);
  
  selectedElement = select('#i');
  selectedElement.mouseOver(openCaioITab);
  selectedElement.mouseClicked(closeCaioITab);
  selectedElement.touchStarted(openCaioITab);
  
  selectedElement = select('#o');
  selectedElement.mouseOver(openCaioOTab);
  selectedElement.mouseClicked(closeCaioOTab);
  selectedElement.touchStarted(openCaioOTab);
  
  selectedElement = select('#caiosP');
  selectedElement.mouseClicked(sampleCaioDraw);
  
  navCaioElementControl = new ElementControl('#navCAIO');
  divCountElementControl = new ElementControl('#caiosCountDiv');
  cTab = new ElementControl('#cTab');
  aTab = new ElementControl('#aTab');
  iTab = new ElementControl('#iTab');
  oTab = new ElementControl('#oTab');
  caiosP = new ElementControl('#caiosP');
 
  selectedElement = select('canvas');
  selectedElement.mouseClicked(closeCaioTabs);
  selectedElement.touchStarted(closeCaioTabs);
  
  frameRate(60);
  targetFrameRate = 60;
  
  if(caiosCount > 0 || jumpStartAnimation){
    navCaioElementControl.startOpacityChange(80, 1);
    divCountElementControl.startOpacityChange(80, 1);
  }
}

function update(){
  if(caiosVec.length < DEFAULT_MAXCAIONUM){
    addNewCaio();
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
    
    if(framesCounter == int(targetFrameRate*4.5) || caiosCount > 0){
      changingNavFonts = true;
    }
  }
  
  navCaioElementControl.update();
  divCountElementControl.update();
  cTab.update();
  aTab.update();
  iTab.update();
  oTab.update();
  
  if(drawSampleCaio && random(0, 1.001) > 0.98){
    sampleCaioIndex = int(random(0, caiosVec.length/4));
  }
}

function draw() {
  translate(-windowWidth/2, -windowHeight/2);
  update();
  
  background(backgroundColor);
  
  for (let index = 0; index < caiosVec.length; index++){
    caiosVec[index].drawCaio();
  }
  
  if(drawSampleCaio && caiosVec.length > 0){
    let elementPos = select('#caiosCountDiv').position();
    let elementSize = select('#caiosCountDiv').size();
    
    let samplePosition = new Point(
      elementPos.x + (elementSize.width/2),
      elementPos.y + 55 +(elementSize.height/2),
      1
    );
    stroke(255, 255, 255);
    fill(color(255, 255, 255, 200));
    triangle((elementPos.x + (elementSize.width/2)), elementPos.y + (caiosP.size.height) + caiosP.position.y, (elementPos.x + caiosP.position.x + (caiosP.size.width)) - 15, elementPos.y + 40, (elementPos.x + caiosP.position.x + (caiosP.size.width))+ 15, elementPos.y + 40);
    stroke(255, 255, 255);
    fill(color(255, 204, 255, 200));
    rect(elementPos.x, elementPos.y + 40, elementSize.width, (elementSize.height * 2) - 20);
    caiosVec[0].drawCaioAsSample(samplePosition);
  }
}

function addNewCaio(caiosMode = CAIOSMODE_DEFAULT){
  if(caiosMode == CAIOSMODE_DEFAULT){ //----------------------------------------- DEFAULT
    let newCaioX = 0;
    let newCaioY = 0;
    let newCaioZ = random(DEFAULT_MAXZ, -DEFAULT_MAXZ/2);
    if(newCaioZ >= 0){
      newCaioX = random(windowWidth/2.4, windowWidth - (windowWidth/2.4));
      newCaioY = random(-2*windowHeight, -windowHeight);
    }
    else {
      if(newCaioZ < DEFAULT_MAXZ/2){
        newCaioX = random(windowWidth/3, windowWidth - (windowWidth/3));
        newCaioY = random(-windowHeight + (2*DEFAULT_MAXZ), -windowHeight + (1.5*DEFAULT_MAXZ));
      }
      else {
        newCaioX = random(windowWidth/20, windowWidth - (windowWidth/20));
        newCaioY = random(-windowHeight + (DEFAULT_MAXZ), -windowHeight + DEFAULT_MAXZ/2);
      }
    }
    
    let caio = new Caio(new Point(newCaioX, newCaioY, newCaioZ), new Color(random(-15, 30), random(-15, 30), random(-15, 30)), true);
    caio.speed.y = random(5, 6.5);
    caio.acceleration.y = random(1, 5) * 0.0035;
    caiosVec.push(caio);
  }
}

function sampleCaioDraw(){
  drawSampleCaio = !drawSampleCaio;
}

function openCloseContent(spanElementId){
  let spanElement = select(spanElementId);
  print(spanElementId);
  let h3Sign = select('#sign', spanElement);
  let parent = spanElement.elt.parentElement;
  let pContent = select('span.pContent', parent);
  
  if(spanElement.elt.attributes.val.value == 0){
    spanElement.elt.attributes.val.value = 1;
    pContent.style("display: inline;");
    h3Sign.elt.innerHTML = "▾";
    
    if(spanElement.elt.attributes.loadedMedia.value == 0){
      let elements = pContent.elt.querySelectorAll('.videoWrapper, .scoreWrapper');
      elements.forEach(element => {
          loadIFrame(element);
      });
      
      spanElement.elt.attributes.loadedMedia.value = 1;
    }
  }
  else {
    spanElement.elt.attributes.val.value = 0;
    pContent.style("display: none;");
    h3Sign.elt.innerHTML = "▸";
  }
}

function loadIFrame(element){
  element.innerHTML = '';
  let src = element.attributes.val.value;
 
  var div = document.createElement('iframe');
  
  var iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('src', src);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', true);
  
  element.appendChild(iframe);
}

function compsFeed(typeToFeed){
  if(typeToFeed != currentCompType){
    selectedElement = select(currentCompContentId);
    selectedElement.style("display: none;");
    
    selectedElement = select(currentCompNamesId);
    selectedElement.style("display: none;");
    
    if(typeToFeed == 's'){
      currentCompContentId = '#spanSoloContent';
      currentCompNamesId = '#spanSoloNames';
    }
    else if(typeToFeed == 'd'){
      currentCompContentId = '#spanDuoContent';
      currentCompNamesId = '#spanDuoNames';
    }
    else if(typeToFeed == 't'){
      currentCompContentId = '#spanTrioContent';
      currentCompNamesId = '#spanTrioNames';
    }
    else if(typeToFeed == 'q'){
      currentCompContentId = '#spanQuartetoContent';
      currentCompNamesId = '#spanQuartetoNames';
      
    }
    else{ // g
      currentCompContentId = '#spanMaisContent';
      currentCompNamesId = '#spanMaisNames';
    }
    
    
    selectedElement = select(currentCompContentId);
    selectedElement.style("display: block;");
    
    selectedElement = select(currentCompNamesId);
    selectedElement.style("display: block;");
    
    currentCompType = typeToFeed;
  }
}

function improsFeed(typeToFeed){
  if(typeToFeed != currentCompType){
    selectedElement = select(currentCompContentId);
    selectedElement.style("display: none;");
    
    selectedElement = select(currentCompNamesId);
    selectedElement.style("display: none;");
    
    if(typeToFeed == 's'){
      currentCompContentId = '#spanSoloContent';
      currentCompNamesId = '#spanSoloNames';
    }
    else if(typeToFeed == 'c'){
      currentCompContentId = '#spanCACOContent';
      currentCompNamesId = '#spanCACONames';
    }
    else{ // g
      currentCompContentId = '#spanMaisContent';
      currentCompNamesId = '#spanMaisNames';
    }
    
    selectedElement = select(currentCompContentId);
    selectedElement.style("display: block;");
    
    selectedElement = select(currentCompNamesId);
    selectedElement.style("display: block;");
    
    currentCompType = typeToFeed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight + 200);
  
  if(heightTooShort == false && windowHeight < 450){
    selectedElement = select('#h1PageName');
    selectedElement.style("display: none;");
    
    selectedElement = select('#h4PageNameSmall');
    selectedElement.style("display: inline;");
    
    selectedElement = select('#navContentNames');
    selectedElement.style("display: none;");
    
    selectedElement = select('#navContentTypes');
    selectedElement.style("top: 91%");
    
    selectedElement = select('#divContent');
    selectedElement.style("width:88%;");
    selectedElement.style("height:90%;");
    selectedElement.style("top:5%;");
    
    selectedElement = select('#oIndex');
    selectedElement.style("display: none;");
    
    heightTooShort = true;
  }
  else if(heightTooShort == true && windowHeight >= 450){
    selectedElement = select('#h1PageName');
    selectedElement.style("display: inline;");
    
    selectedElement = select('#h4PageNameSmall');
    selectedElement.style("display: none;");
    
    if(widthTooShort == false){
      selectedElement = select('#navContentNames');
      selectedElement.style("display: block;");
    
      selectedElement = select('#navContentTypes');
      selectedElement.style("top: 93%");
      
      selectedElement = select('#divContent');
      selectedElement.style("width:75%;");
      selectedElement.style("height:95%;");
      selectedElement.style("top:0%;");
      
      selectedElement = select('#oIndex');
      selectedElement.style("display: inline-block;");
    }
    
    heightTooShort = false;
  }
  
  if(widthTooShort == false && windowWidth < 450){
    selectedElement = select('#navContentNames');
    selectedElement.style("left:74%;");
    
    selectedElement = select('#navContentNames');
    selectedElement.style("display: none;");
    
    selectedElement = select('#divContent');
    selectedElement.style("width:90%;");
    
    selectedElement = select('#oIndex');
    selectedElement.style("display: none;");
    
    widthTooShort = true;
    
    
  }
  else if(widthTooShort == true && windowWidth >= 450){
    selectedElement = select('#navContentNames');
    selectedElement.style("left:80%;");
    
    if(heightTooShort == false){
      selectedElement = select('#navContentNames');
      selectedElement.style("display: block;");
      
      selectedElement = select('#divContent');
      selectedElement.style("width:75%;");
      
      selectedElement = select('#oIndex');
      selectedElement.style("display: inline-block;");
    }
    
    widthTooShort = false;
  }
  
  DEFAULT_MAXCAIONUM = windowWidth / 10; 
  
  if(curPage == "bio.html"){
    changeHeadshot();
  }
}

function changeHeadshot(){
  selectedElement = select('#headshotImg');
  let headNumber = int(random(1,6.9));
  let path = './imgs/headshot' + str(headNumber) + '.JPG';
  selectedElement.elt.src = path;
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
    
    if(random(0, 1.001) > 0.4){
      if(curPage == "bio.html"){
        changeHeadshot();
      }
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

function pageChange(nextPage) {
  window.location.href = nextPage + "#" + caiosCount;
}
