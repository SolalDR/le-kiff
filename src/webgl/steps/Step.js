import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";
import * as GUI from "~/services/gui";
import ConfigManager from "~/services/ConfigManager";
import SoundManager from "~/services/soundManager/SoundManager";
import {AnimationManager} from "~/webgl/manager";
import {Animation} from "~/webgl/manager/Animation";
import ModelAnimationManager from "../manager/ModelAnimation";
import AbilitiesManager from "../../services/AbilitiesManager";

/**
 * @class
 */
class Step extends Event {

  /**
   * @constructor
   * @param {Scene} scene
   * @param {Object} datas 
   * @param {[string]} availableScale
   * @param {[Info]} points A list of point See ~/webgl/manager/Info/components/Info.js
   */
  constructor({
    scene = null,
    datas = {}
  } = {}, persistentObjects = []){
    super();
    this.scene= scene;
    this.id = datas.id;
    this.rank = datas.rank;
    this.chapter_rank = datas.chapter_rank;
    this.content = datas.content;
    this.infos = datas.infos
    this.persistentObjects = persistentObjects;
    this.folder = {};

    this.state = {
      initialised: false,
      guiInitialized: false
    }

    this.parentGUI = GUI["guiChapter"+this.chapter_rank];
    this.gui = GUI.active ? this.parentGUI.addFolder("Step "+this.rank) : null;
  }

  getRemovableObject(step){
    var toRemove = [];
    this.persistentObjects.forEach(name => {
      if(!step.persistentObjects.includes(name)){
        toRemove.push(name);
      }
    })
    return toRemove;
  }

  getMissingObject(step){
    var toAdd = [];
    step.persistentObjects.forEach(name => {
      if(!this.persistentObjects.includes(name)){
        toAdd.push(name);
      }
    })
    return toAdd;
  }

  manageInfos(infos){

  }

  updateSoundsPlayBack(e) {
    if(this.config.sounds) {
      const soundsDatas = [];
      this.config.sounds.forEach(data => {
        data.sound = e[data.name].result
        soundsDatas.push(data);
      });
      SoundManager.updatePlayBack(soundsDatas);
    }
  }

  // if not next step reset all anims
  resetModelAnimation() {
    if(this.previousStep && !this.isNextStep()) {
      ModelAnimationManager.reset();
    }
  }

  init(config, previousStep){
    this.config = config;
    this.previousStep = previousStep;
    this.state.initialised = true;

    this.resetModelAnimation();

    if( this.state.initialised ){
      Bus.dispatch("step:init", this);
      this.dispatch("init");
    }
  }

  beforeDisplay(){
    AbilitiesManager.can("all", false);
  }

  display(event) {
    ConfigManager.updateConfig(this.config);
    this.scene.microScale.updateFromStep(this);
    this.scene.macroScale.updateFromStep(this);
    this.scene.humanScale.updateFromStep(this);

    this.scene.humanScale.updateRendering({animate: true});
    this.updateSoundsPlayBack(event);

    Bus.dispatch("step:display", this);
    this.dispatch("display");
  }
  

  hide( nextStep ){
    
    // Next step don't follow current step
    if( nextStep.rank !== this.rank + 1) {
      Bus.verbose("step:prevent-hide Change step", 2);
      this.scene.renderer.setBloomThreshold(0);
      var config = this.config[this.scene.state.currentScale].transitions[this.scene.state.currentScale];
      this.scene.renderer.setBloomIntensity(config.postprocess.bloom.strength.to);
      var diff = config.postprocess.bloom.strength.from - config.postprocess.bloom.strength.to;
      // postprocess anim
      AnimationManager.addAnimation(new Animation({
          duration: 1000,
        }).on("progress", ( event ) => {
          this.scene.renderer.setBloomIntensity( config.postprocess.bloom.strength.to + event.advancement*diff );
        }).on("end", ()=>{
          Bus.dispatch("step:hide", this);
          this.dispatch("hide");
        })
      );
      // remove all sounds effects
      SoundManager.removeAllEffects();

      return; 
    } 

    // If different of human
    if( this.scene.state.currentScale !== "human" ){
      Bus.verbose("step:prevent-hide Change scale", 2);
      this.scene.selectScale("human");
      Bus.once('scale:hide', ()=>{
        Bus.dispatch("step:hide", this);
        this.dispatch("hide");
      })
      return;
    }


    Bus.dispatch("step:hide", this);
    this.dispatch("hide");
  }

  isNextStep() {
    if(this.previousStep) {
      return this.rank - 1 === this.previousStep.rank;
    } else {
      return false;
    }
  }

  /**
   * Update light in step with alpha parameter to interpolate values
   * @param {Object} config config object for lights
   * @param {Number} alpha alpha number 0 to 1
   */
  updateLights(config, alpha = 1) {
    // Lights List
    var lights = [
      {
        name: 'primary',
        object: this.scene.lightPrimary
      },
      {
        name: 'secondary',
        object: this.scene.lightSecondary
      },
      {
        name: 'ambient',
        object: this.scene.lightAmbient
      }
    ]

    // Init new config
    var newConfigFilled = false
    var newConfig = {};

    // Assign params from config for each lights
    lights.forEach(light => {

      newConfig[light.name] = {};
      var targetRotation = new THREE.Vector3();
      var lightStartParams = Object.assign({},light.object);

      Object.entries(config[light.name]).forEach(([key, value]) => {
        if(value instanceof THREE.Vector3 || value instanceof THREE.Color) {
        } else if (value instanceof THREE.Euler) {
          var targetVec3 = value.toVector3();
          var sourceVec3 = lightStartParams.rotation.toVector3();
          targetRotation.lerpVectors(targetVec3, sourceVec3, alpha);
          light.object[key].fromVector3(targetRotation);
        } else {
          light.object[key] = lightStartParams[key] * (1 - alpha) + value * alpha;
        }
        if(alpha > 0.99 && !newConfigFilled) {
          newConfig[light.name][key] = light.object[key];
        }
      });
      
    })

    if(alpha > 0.99 && !newConfigFilled) {
      newConfigFilled = true;
      return newConfig;
    }
  }

  /**
   * Raf method
   * @abstract
   */
  loop() {
  }
}

export default Step;
