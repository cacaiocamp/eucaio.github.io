class ElementControl {  
  constructor(elementId) { 
    this.id = elementId;
    
    let selectedElement = this.select();
    this.opacity = int(selectedElement.style('opacity'));
    
    this.targetOpacity = 0
    this.framesToTargetOpacity = 0;
    this.opacityChangePerFrame = 0;
    this.frameCount = 0;
    
    this.position = selectedElement.position();
    this.size = selectedElement.size();
  }
  
  select(){
    return select(this.id);
  }
  
  update(){
    if(this.frameCount < this.framesToTargetOpacity){
      this.opacity = this.opacity + this.opacityChangePerFrame;
      
      this.frameCount = this.frameCount + 1;
      
      this.setStyleProperty('opacity', this.opacity + '%');
    }
    
    if(this.opacity <= 0.1){
      this.display(false);
    }
  }
  
  setStyleProperty(property, value){
    this.select().style(property, value);
  }
  
  startOpacityChange(newOpacity, durationInFrames, display = null){
    if(this.frameCount == this.framesToTargetOpacity){
      this.frameCount = 0;
      this.targetOpacity = newOpacity;
      this.framesToTargetOpacity = durationInFrames;
      this.opacityChangePerFrame = (this.targetOpacity - this.opacity) / this.framesToTargetOpacity;
    
      this.display(true, display);
    }
  }
  
  display(onOff, otherDisplay = null){
    let selectedElement = this.select();
      
    if(onOff == true){
      if(otherDisplay != null){
        selectedElement.style('display', otherDisplay);
      }
      else{
        selectedElement.style('display: inline;');
      }
    }
    else{
        selectedElement.style('display: none;');
    }
  }
}
