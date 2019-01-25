import Event from "~/helpers/Event"; 
import ClipAnimationUtils from "../../helpers/ClipAnimationUtils";

class ModelAnimationManager extends Event {
    
  constructor(){
    super();
    this.models = [];
    this.currentAction = null;
  }

  createClips(model, clipsData, options = {}) { 
    
    // TODO: find in array first if already exist

    const modelAnim = {
      name : model.name,
      mixer: new THREE.AnimationMixer(model.scene),
      clips: []
    } 

    // TODO: add to options
    if(options.timeScale) modelAnim.mixer.timeScale = options.timeScale;
    modelAnim.mainClip = modelAnim.mixer.clipAction( model.animations[0] );

    for (var i = 0; i < clipsData.length; i++) { 
      const clip = clipsData[i];
      const loopType = clip.loop !== undefined ? clip.loop : THREE.LoopOnce;
      clip.animation = modelAnim.mixer.clipAction(ClipAnimationUtils.subclip(modelAnim.mainClip._clip, clipsData[i].name , clipsData[i].firstFrame, clipsData[i].lastFrame ));
      clip.animation.setLoop( loopType );
      clip.animation.clampWhenFinished = true;
      modelAnim.clips.push(clip);
    }

    this.currentAction = clipsData[0].animation;

    this.models.push(modelAnim);
  }

  play(modelName, clipName) {
    if(this.currentAction.isRunning()) return;
    
    // TODO: if no clipname passed play global anim
    
    var mixer;
    var activeAction;
    var lastAction = this.currentAction;
    var modelAnim = this.models.find(u => u.name === modelName);
    var activeAnimation = modelAnim.clips.find(u => u.name === clipName);
    activeAction = activeAnimation.animation;
    mixer = activeAction.getMixer();

    if(activeAction === lastAction) {
        activeAction.stop().play();
    } else {
        activeAction.play();
        lastAction.stop();
    }

    // set currentAction
    this.currentAction = activeAction;

    // anim chain
    const isLooping = activeAction.loop === THREE.LoopRepeat;
    const eventLabel = isLooping ? 'loop' : 'finished';
    return new Promise(function(resolve, reject) {
      mixer.addEventListener(eventLabel, () => {
        if (isLooping) activeAction.timeScale = 0;
        resolve();
      });
    });
  }

  update(delta) { 
    if ( this.models.length > 0 ) {
      for ( var i = 0; i < this.models.length; i ++ ) {
          this.models[i].mixer.update(delta);
      }
    }
  }

}

export default new ModelAnimationManager();
