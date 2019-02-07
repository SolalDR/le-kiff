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

  play(clipName = this.mainClip.name, {
    loop = false,
    timeScale = 0.5
  } = {}){

    var action = this.clips.find(u => u.name === clipName);
    if( !action ) return;
    this.running = true;
    var animation = action.animation;
    
    animation.timeScale = timeScale;
    var mixer = animation.getMixer();

    animation.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;

    animation.play();
    this.currentAction = action;
    
    return new Promise((resolve, reject) => {
      mixer.addEventListener(
        loop ? 'loop' : 'finished', 
        _ => {
          resolve();
          animation.timeScale = 0;
          if (!loop) this.running = false;
        }, 
        {
          once: true
        }
      );
    });
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
