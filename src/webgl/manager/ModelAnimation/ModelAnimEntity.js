class ModelAnimEntity {
    
  constructor({
    model,
    options
  } = {}){
    this.model = model;
    this.name = model.name;
    this.mixer= new THREE.AnimationMixer(model.scene);
    this.options = options;
    this.clips= [];
    this.currentAction= null;
    this.running= false;
    this.uid = Math.random (Math.random * 10);

    this.init();
  }

  init() {
    this.setOptions();
    this.setMainClip();
  }
  
  setOptions() {
    if(this.options.timeScale) this.mixer.timeScale = this.options.timeScale;
  }

  setMainClip() {
    this.mainClip = {
      name: 'main',
      animation : this.mixer.clipAction( this.model.animations[0] )
    }
  }

}

export default ModelAnimEntity;
