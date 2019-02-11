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

  /**
   * Return the list of object to remove
   * @param {Step} step 
   * @return {[string]}
   */
  getRemovableObject(step){
    var toRemove = [];
    this.persistentObjects.forEach(name => {
      if(!step.persistentObjects.includes(name)){
        toRemove.push(name);
      }
    })
    return toRemove;
  }

  /**
   * Return the list of object to add
   * @param {Step} step 
   * @return {[string]}
   */
  getMissingObject(step){
    var toAdd = [];
    step.persistentObjects.forEach(name => {
      if(!this.persistentObjects.includes(name)){
        toAdd.push(name);
      }
    })
    return toAdd;
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

  /**
   * Call before display
   * @param {Obejct} ressources 
   * @param {Step} previousStep 
   */
  beforeDisplay(ressources, previousStep){
    // Bloc all interaction
    AbilitiesManager.can("all", false);
    if( previousStep && previousStep.rank === this.rank - 1 ){
      this.beforeDisplayFollow(ressources, previousStep)
    } else {
      this.beforeDisplayMessy(ressources, previousStep)
    }
  }

  /**
   * Called when the next step follow the previous step in chronological order
   */
  beforeDisplayFollow(){}

  /**
   * Called when the next step isn't following the previous step
   */
  beforeDisplayMessy(){}

  /**
   * Called after displayHumanScale to notice the all application a new step is displayed
   * @param {Object} event 
   */
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

  /**
   * Update the sounds when a new step is displayed
   * @param {Object} e 
   */
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
  
  /**
   * Called when the next step follow the previous step in chronological order
   */
  beforeDisplayFollow(){}

  /**
   * Called when the next step isn't following the previous step
   */
  beforeDisplayMessy(){}


  /**
   * Call before hide
   * @param {Step} nextStep 
   */
  beforeHide(nextStep){
    if( nextStep.rank === this.rank + 1 ){
      this.beforeHideFollow(nextStep)
    } else {
      this.beforeHideMessy(nextStep)
    }
  }

  /**
   * Called when the next step follow the current step in chronological order
   */
  beforeHideFollow(){}

  /**
   * Called when the next step isn't following the previous step
   */
  beforeHideMessy(){}




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
   * Raf method
   * @abstract
   */
  loop() {
  }
}

export default Step;
