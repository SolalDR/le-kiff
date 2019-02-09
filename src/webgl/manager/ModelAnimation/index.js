import Event from "~/helpers/Event"; 
import ClipAnimationUtils from "../../helpers/ClipAnimationUtils";
import ModelAnimation from "./components/ModelAnimation";

class ModelAnimationManager extends Event {
    
  constructor(){
    super();
    this.models = new Map();
    this.activeModel = null;
  }

  generateClips(model, clipsData = null, options = {}) {
    
    const modelAnim = this._getModelAnim(model, options);

    // create clips from clips data
    if(clipsData) {
      for (var i = 0; i < clipsData.length; i++) { 
        const clipData = clipsData[i];
        if(!modelAnim.clips.find(clip => clip.name === clipData.name)) {
          const clip = this._createClip(modelAnim, clipData);
          modelAnim.clips.push(clip);
        }
      }

      // set first clip has current action
      modelAnim.currentAction = clipsData[0].animation;

    } else {
      // set main model anim for currentAction
      modelAnim.currentAction = modelAnim.mainClip.animation;
    }
    
    // add modelAnim to list
    this.models.set(modelAnim.name, modelAnim);

    // set modelAnim to active
    this.activeModel = modelAnim;

    return modelAnim;
  }

  _getModelAnim(model, options) {
    // find if already exist
    let modelAnim = this.models.get(model.name);

    // if not create new modelAnim
    if(!modelAnim) {
      modelAnim = new ModelAnimation({
        model,
        options
      })
    }
    return modelAnim
  }

  _createClip(modelAnim, clipData) {
    const clip = clipData;
    const loopType = clip.loop !== undefined ? clip.loop : THREE.LoopOnce;
    clip.animation = modelAnim.mixer.clipAction(ClipAnimationUtils.subclip(modelAnim.mainClip.animation._clip, clipData.name , clipData.firstFrame, clipData.lastFrame ));
    clip.animation.setLoop( loopType );
    clip.animation.clampWhenFinished = true;
    return clip;
  }
  
  clear() {
    this.activeModel = null;
    this.models.clear();
  }

  stopAll() {
    if ( this.models.size > 0 ) {
      for (var model of this.models.values()) {
        if(model.running) {
          //model.mixer.stopAllAction();
          for(var clip of model.clips) {
            clip.animation.stop();
          }
          model.running = false;
        } 
      }
      model.mainClip.animation.play().stop();
    }
  }

  reset() {
    this.stopAll();
    this.clear();
  }

  update(delta) { 
    if ( this.models.size > 0 ) {
      for (var model of this.models.values()) {
        if(model.running) model.mixer.update(delta);
      }
    }
  }
}

export default new ModelAnimationManager();
