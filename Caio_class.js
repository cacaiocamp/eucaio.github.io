const DEFAULT_HEADRADIUS = 5.5;
const DEFAULT_TORSOWIDTH = 4;
const DEFAULT_TORSOHEIGHT = 10;
const DEFAULT_FEMURWIDTH = 4;
const DEFAULT_FEMURHEIGHT = 7;
const DEFAULT_TIBIAWIDTH = 4;
const DEFAULT_TIBIAHEIGHT = 7;

const DEFAULT_MAXZ = -3750;
const DEFAULT_MAXCOLOR = 190;
const DEFAULT_MINCOLOR = 120;

const MAX_GENERALROTATIONPERFRAME = 7;

const MAX_ARMROTATION = 180;
const MAX_FEMURROTATION = 95;
const MAX_TIBIAROTATION = 130;

const NUM_TRAILS = 5;

/*
  each caio is made of 4 parts: head (circle), torso, femur and tibia (rectangles)
  180 rotation is a standing rotation, with 0 beign full north;;
  head and torso are glued and only rotate (translate) with the full Caio translation;
  femur is glued to the torso, but has also an independent rotation;
  tibia is glued to the femur, but also has an independent rotation;
*/

class Caio {  
  constructor(positionPoint, newColor, setRandomSpeedX = false) {    
    //global rotation control Initializations
    this.targetGlobalRotationPerFrame = 0;
    this.framesToTargetGlobalRotation = 0;
    this.globalRotationChangeFrameCount = 0;
    this.globalRotationChangePerFrame = 0;
    this.globalRotationChangePerFrameToTarget = 0;
    this.continuousGlobalRotation = false;
    this.constantRandomGlobalRotation = true;
    this.targetGlobalRotation = 0;
    
    //femur rotation control Initializations
    this.targetFemurRotation = 0;
    this.framesToTargetFemurRotation = 0;
    this.femurRotationChangeFrameCount = 0;
    this.femurRotationChangePerFrame = 0;
    this.continuousFemurRotation = false;

    //tibia rotation control Initializations
    this.targetTibiaRotation = 0;
    this.framesToTargetTibiaRotation = 0;
    this.tibiaRotationChangeFrameCount = 0;
    this.tibiaRotationChangePerFrame = 0;
    this.continuousTibiaRotation = false;
    
    //proportions Initializations
    this.generalProp = 1.25;
    this.headProp = 1.4;
    this.torsoWidthProp = 0.9;
    this.torsoHeightProp = 1;
    this.femurWidthProp = 1;
    this.femurHeightProp = 1;
    this.tibiaWidthProp = 1;
    this.tibiaHeightProp = 1;
    
    //movement initializations
    this.speed = new Point(0, 0, 0);
    this.randomXSpeed = new Point(0, 0);
    this.randomZSpeed = new Point(0, 0);
    this.setRandomXSpeed = true;
    this.setRandomZSpeed = false;
    this.acceleration = new Point(0, 0, 0);
    
    this.position = positionPoint;
    this.mainColor = newColor;  
    this.setColorDepth();
    
    if(random(0, 1.001) > 0.5){
      this.orientation = -1;
    }
    else {
      this.orientation = 1;
    }
    
    if(random(0, 1.001) > 0.7){
      this.hasArm = true;
    }
    
    this.globalRotation = random(-1.5, 1.5);
    this.femurRotation = 0;
    this.tibiaRotation = 0;
    
    this.setFemurRotation();
    this.setTibiaRotation();
    
    this.setRandomSpeedX = setRandomSpeedX;
    if(this.setRandomSpeedX == true){
      this.randomXSpeed = new Point(random(-0.008, -0.0015), random(0.0015, 0.008), 0); //z just for default - x and y set the range for the random speed
    }
  }
  
  setConstantRandomGlobalRotation(newRotationPerFrame) {
      this.globalRotationChangeFrameCount = 0;
      this.framesToTargetGlobalRotation = 0;
      this.targetGlobalRotationPerFrame = 0;
      this.globalRotationChangePerFrame = newRotationPerFrame;

      this.continuousGlobalRotation = false;
      this.constantRandomGlobalRotation = true;
  }
  
  setGlobalRotation(newRotationPerFrame = random(-4, 4), frameDur = int(random(40, 120)), continuousRotationAfter = true) {
      this.globalRotationChangeFrameCount = 0;
      this.framesToTargetGlobalRotation = frameDur;

      if (newRotationPerFrame > 0) {
        if(newRotationPerFrame > MAX_GENERALROTATIONPERFRAME){
          this.targetGlobalRotationPerFrame = newRotationPerFrame + (-1 * (newRotationPerFrame/2));
        }
      }
      else {
        if (newRotationPerFrame < -1 * MAX_GENERALROTATIONPERFRAME){
          this.targetGlobalRotationPerFrame = newRotationPerFrame + (-1 * (newRotationPerFrame / 2));
        }
      }
      this.globalRotationChangePerFrameToTarget = this.targetGlobalRotationPerFrame / this.framesToTargetGlobalRotation;

      this.continuousGlobalRotation = continuousRotationAfter;
  }
  
  setFemurRotation(newFemurRotation = random(0, MAX_FEMURROTATION), frameDur = int(random(30, 180)), setRandomRotationAfter = true) {
      this.femurRotationChangeFrameCount = 0;
      this.framesToTargetFemurRotation = frameDur;

      if (abs(newFemurRotation) > MAX_FEMURROTATION) {
        newFemurRotation = random(MAX_FEMURROTATION - 10, MAX_FEMURROTATION);
      }
      else if (abs(newFemurRotation) < 0) {
        newFemurRotation = random(0, 11);
      }

      this.targetFemurRotation = abs(newFemurRotation) * this.orientation;
      this.femurRotationChangePerFrame = (this.targetFemurRotation - this.femurRotation) / this.framesToTargetFemurRotation;

      this.continuousFemurRotation = setRandomRotationAfter;
  }
  
  setTibiaRotation(newTibiaRotation = random(0, MAX_TIBIAROTATION), frameDur = int(random(30, 180)), setRandomRotationAfter = true) {
      this.tibiaRotationChangeFrameCount = 0;
      this.framesToTargetTibiaRotation = frameDur;

      if (abs(newTibiaRotation) > MAX_TIBIAROTATION) {
        newTibiaRotation = random(MAX_TIBIAROTATION - 10, MAX_TIBIAROTATION);
      }
      else if (abs(newTibiaRotation) < 0) {
        newTibiaRotation = random(0, 11);
      }

      this.targetTibiaRotation = abs(newTibiaRotation) * this.orientation * -1;
      this.tibiaRotationChangePerFrame = (this.targetTibiaRotation - this.tibiaRotation) / this.framesToTargetTibiaRotation;

      this.continuousTibiaRotation = setRandomRotationAfter;
  }
  
  updateCaio(){
      //global rotation update
      if (this.globalRotationChangePerFrame != this.targetGlobalRotationPerFrame && this.globalRotationChangeFrameCount != this.framesToTargetGlobalRotation) {
        this.globalRotationChangePerFrame = this.globalRotationChangePerFrame + this.globalRotationChangePerFrameToTarget;
        this.globalRotationChangeFrameCount++;
      }
      else if (this.globalRotationChangeFrameCount == this.framesToTargetGlobalRotation && this.continuousGlobalRotation) {
        let newChangePerFrame = 0;

        if (this.globalRotationChangePerFrame > 0) {
          newChangePerFrame = random(-this.globalRotationChangePerFrame / 2, this.globalRotationChangePerFrame / 2);
        }
        else {
          newChangePerFrame = random(-this.globalRotationChangePerFrame / 2, this.globalRotationChangePerFrame / 2);
        }

        this.setGlobalRotation(newChangePerFrame, int(random(60, 300)));
      }
      else if (this.constantRandomGlobalRotation && this.framesToTargetGlobalRotation == 0) {
        if (random(0, 1.01) > 0.95) {
          this.setConstantRandomGlobalRotation(this.globalRotationChangePerFrame + random(-0.6, 0.6));
        }
        else if (random(0, 1.0001) > 0.999) {
          this.setConstantRandomGlobalRotation(random(-0.5, 0.5));
        }
      }
      this.globalRotation = this.globalRotation + this.globalRotationChangePerFrame;
      
      // femur rotation update
      if ((this.femurRotation != this.targetFemurRotation) && (this.femurRotationChangeFrameCount != this.framesToTargetFemurRotation)) {
        this.femurRotation = this.femurRotation + this.femurRotationChangePerFrame;
        this.femurRotationChangeFrameCount++;
      }
      else if (this.femurRotationChangeFrameCount >= this.framesToTargetFemurRotation && this.continuousFemurRotation) {
        if (random(0, 1.0001) > 0.95){
          this.setFemurRotation();
        }
        else if(random(0, 1.0001) > 0.75){
          this.setFemurRotation(random(this.femurRotation - (this.femurRotation / 3), this.femurRotation + (this.femurRotation / 3)));
        }
      }
      
      // tibia rotation update
      if (this.tibiaRotation != this.targetTibiaRotation && this.tibiaRotationChangeFrameCount != this.framesToTargetTibiaRotation) {
        this.tibiaRotation = this.tibiaRotation + this.tibiaRotationChangePerFrame;
        this.tibiaRotationChangeFrameCount++;
      }
      else if (this.tibiaRotationChangeFrameCount == this.framesToTargetTibiaRotation && this.continuousTibiaRotation) {
        if (random(0, 1.0001) > 0.95){
          this.setTibiaRotation();
        }
        else if (random(0, 1.0001) > 0.75){
          this.setTibiaRotation(random(this.tibiaRotation - (this.tibiaRotation / 3), this.tibiaRotation + (this.tibiaRotation / 3)));
        }
      }
      
       // femur rotation update
      if ((this.femurRotation != this.targetFemurRotation) && (this.femurRotationChangeFrameCount != this.framesToTargetFemurRotation)) {
        this.femurRotation = this.femurRotation + this.femurRotationChangePerFrame;
        this.femurRotationChangeFrameCount++;
      }
      else if (this.femurRotationChangeFrameCount >= this.framesToTargetFemurRotation && this.continuousFemurRotation) {
        if (random(0, 1.0001) > 0.95){
          this.setFemurRotation();
        }
        else if(random(0, 1.0001) > 0.75){
          this.setFemurRotation(random(this.femurRotation - (this.femurRotation / 3), this.femurRotation + (this.femurRotation / 3)));
        }
      }
      
      //position change
      this.speed.x = this.speed.x + this.acceleration.x;
      this.speed.y = this.speed.y + this.acceleration.y;
      this.speed.z = this.speed.z + this.acceleration.z;

      if(frameRate() <= 0){
        this.position.x = this.position.x + this.speed.x;
        this.position.y = this.position.y + this.speed.y;
        this.position.z = this.position.z + this.speed.z;
      }
      else{
        this.position.x = this.position.x + (this.speed.x * (targetFrameRate/frameRate()));
        this.position.y = this.position.y + (this.speed.y * (targetFrameRate/frameRate()));
        this.position.z = this.position.z + (this.speed.z * (targetFrameRate/frameRate()));
      }

      if (this.setRandomXSpeed) {
        this.speed.x = this.speed.x + random(this.randomXSpeed.x, this.randomXSpeed.y);
      }
  }
  
  drawCaio(){
    noStroke();
    fill(color(this.mainColor.r, this.mainColor.g, this.mainColor.b, this.mainColor.a));
    push();
      translate(this.position.x, this.position.y, this.position.z);
      rotate(this.globalRotation);
      
      circle(0, 0, this.generalProp * this.headProp * DEFAULT_HEADRADIUS); // head
      
      let partsYPos = this.generalProp * this.headProp * DEFAULT_HEADRADIUS / 2;
      rect( // torso
        -(this.generalProp * this.torsoWidthProp * DEFAULT_TORSOWIDTH) / 2,
        partsYPos,
        (this.generalProp * this.torsoWidthProp * DEFAULT_TORSOWIDTH),
        (this.generalProp * this.torsoHeightProp * DEFAULT_TORSOHEIGHT)
      );
      
      push(); //femur start
        partsYPos = partsYPos + (this.generalProp * this.torsoHeightProp * DEFAULT_TORSOHEIGHT);
        
        let rotationPointX = 0;
        let positionAdjustment = 0;

        if (this.orientation == 1) { //left rotation
          rotationPointX = (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH) / 2;
          positionAdjustment = -1 * this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH;
        }
        else { //right rotation
          rotationPointX = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH) / 2;
        }

        translate(
          rotationPointX,
          partsYPos
        );
        rotate(this.femurRotation);
        rect(
          positionAdjustment, 0,
          (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH),
          (this.generalProp * this.femurHeightProp * DEFAULT_FEMURHEIGHT)
        );
        
        push(); //tibia start
          partsYPos = (this.generalProp * this.femurHeightProp * DEFAULT_FEMURHEIGHT);

          if (this.orientation == 1) { //esquerda
            rotationPointX = -(this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
              
            if (this.tibiaRotation <= -90) {
              positionAdjustment = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
            }
            else {
              positionAdjustment = 0;
            }
          }
          else { //direita
            rotationPointX = (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);

            if (this.tibiaRotation < 90 ) {
              positionAdjustment = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
            }
            else {
              positionAdjustment = 0;
            }
          }

          translate(
            rotationPointX,
            partsYPos
          );
          rotate(this.tibiaRotation);
          rect(
            positionAdjustment, 0,
            (this.generalProp * this.tibiaWidthProp * DEFAULT_TIBIAWIDTH),
            (this.generalProp * this.tibiaHeightProp * DEFAULT_TIBIAHEIGHT)
          );
        pop(); // end tibia
      pop(); // end femur
    pop();// end drawing
  }
  
  setColorDepth(){
    let newColor = 0;
    let colorRatio = abs(this.position.z / DEFAULT_MAXZ);
    
    newColor = DEFAULT_MINCOLOR + (colorRatio * (DEFAULT_MAXCOLOR - DEFAULT_MINCOLOR));
    this.mainColor = new Color(newColor + this.mainColor.r, newColor + this.mainColor.g, newColor + this.mainColor.b, 255);
  }
  
  drawCaioAsSample(samplePos){
    noStroke();
    fill(color(this.mainColor.r, this.mainColor.g, this.mainColor.b, this.mainColor.a));
    push();
      translate(samplePos.x, samplePos.y, samplePos.z);
      rotate(this.globalRotation);
      
      circle(0, 0, this.generalProp * this.headProp * DEFAULT_HEADRADIUS); // head
      
      let partsYPos = this.generalProp * this.headProp * DEFAULT_HEADRADIUS / 2;
      rect( // torso
        -(this.generalProp * this.torsoWidthProp * DEFAULT_TORSOWIDTH) / 2,
        partsYPos,
        (this.generalProp * this.torsoWidthProp * DEFAULT_TORSOWIDTH),
        (this.generalProp * this.torsoHeightProp * DEFAULT_TORSOHEIGHT)
      );
      
      push(); //femur start
        partsYPos = partsYPos + (this.generalProp * this.torsoHeightProp * DEFAULT_TORSOHEIGHT);
        
        let rotationPointX = 0;
        let positionAdjustment = 0;

        if (this.orientation == 1) { //left rotation
          rotationPointX = (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH) / 2;
          positionAdjustment = -1 * this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH;
        }
        else { //right rotation
          rotationPointX = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH) / 2;
        }

        translate(
          rotationPointX,
          partsYPos
        );
        rotate(this.femurRotation);
        rect(
          positionAdjustment, 0,
          (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH),
          (this.generalProp * this.femurHeightProp * DEFAULT_FEMURHEIGHT)
        );
        
        push(); //tibia start
          partsYPos = (this.generalProp * this.femurHeightProp * DEFAULT_FEMURHEIGHT);

          if (this.orientation == 1) { //esquerda
            rotationPointX = -(this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
              
            if (this.tibiaRotation <= -90) {
              positionAdjustment = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
            }
            else {
              positionAdjustment = 0;
            }
          }
          else { //direita
            rotationPointX = (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);

            if (this.tibiaRotation < 90 ) {
              positionAdjustment = - (this.generalProp * this.femurWidthProp * DEFAULT_FEMURWIDTH);
            }
            else {
              positionAdjustment = 0;
            }
          }

          translate(
            rotationPointX,
            partsYPos
          );
          rotate(this.tibiaRotation);
          rect(
            positionAdjustment, 0,
            (this.generalProp * this.tibiaWidthProp * DEFAULT_TIBIAWIDTH),
            (this.generalProp * this.tibiaHeightProp * DEFAULT_TIBIAHEIGHT)
          );
        pop(); // end tibia
      pop(); // end femur
    pop();// end drawing
  }
}
