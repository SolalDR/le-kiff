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
    loop = THREE.LoopOnce,
    timeScale = 0.5,
    restart = true,
    chain = false
  } = {}){
    var looping = (loop === THREE.LoopRepeat);
    var lastAnimation = this.currentAction.animation;
    var action = this.clips.find(u => u.name === clipName);
    if( !action ) return;
    this.running = true;
    var animation = action.animation;
    
    animation.timeScale = timeScale;
    var mixer = animation.getMixer();
    animation.loop = loop;

    if(chain) {
      // if chain with loop fade from last animation
      if(lastAnimation && lastAnimation.loop === THREE.LoopRepeat) {
        lastAnimation.crossFadeTo(animation, 2, true);   
        setTimeout(() => {
          lastAnimation.stop();
        }, 2000)   
        console.log('cross fade animations');
      // play and stop previous    
      } else {
        animation.play();
        if(lastAnimation) lastAnimation.stop();
      }
    } else {
      animation.play();
    }

    if( restart ){
      if( timeScale < 0 ){
        animation.time  = animation.getClip().duration;
      } else {
        animation.time = 0;
      }
    }

    animation.paused = false;
    
    this.currentAction = action;
    
    return new Promise((resolve, reject) => {
      mixer.addEventListener(
        looping ? 'loop' : 'finished', 
        _ => {
          resolve(action);
          if (!looping) {
             this.running = false;
             animation.timeScale = 0;
          }
        }, 
        {
          once: true
        }
      );
    });
  }

  startAtClip(clipName = this.mainClip.name) {
    this.play(clipName);
    this.pause(clipName);
  }

  stop(clipName = this.mainClip.name) {
    var action = this.clips.find(u => u.name === clipName);
    action.animation.stop();
    this.running = false;
  }

  pause(clipName = this.mainClip.name) {
    var action = this.clips.find(u => u.name === clipName);
    action.animation.paused = true;
    //this.running = false;
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
    this.clips.push((this.mainClip));
    this.currentAction = this.mainClip;
  }

}

export default ModelAnimEntity;
