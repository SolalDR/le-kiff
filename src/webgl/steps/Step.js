import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";
import * as GUI from "~/services/gui";
import ConfigManager from "~/services/ConfigManager";
import SoundManager from "~/services/soundManager/SoundManager";
import InfoManager from "~/webgl/manager/Info";
import ModelAnimationManager from "../manager/ModelAnimation";

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
  } = {}){
    super();
    this.scene= scene;
    this.id = datas.id;
    this.rank = datas.rank;
    this.chapter_rank = datas.chapter_rank;
    this.content = datas.content;
    this.infos = datas.infos;
    
    this.state = {
      initialised: false
    }

    this.parentGUI = GUI["guiChapter"+this.chapter_rank];
    this.gui = this.parentGUI.addFolder("Step "+this.rank);
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

  init(config, previousStep){
    this.config = config;
    this.state.initialised = true;
    this.previousStep = previousStep;

    // if not next step reset all anims
    if(this.previousStep && !this.isNextStep()) {
      console.log('modelAnimationManager stop all');
      ModelAnimationManager.stopAll();
      ModelAnimationManager.clear();
      //ModelAnimationManager.stopAll();
    }

    Bus.dispatch("step:init", this);
    this.dispatch("init"); 
  }

  display(event) {
    ConfigManager.updateConfig(this.config);
    this.scene.microScale.updateFromStep(this);
    this.scene.macroScale.updateFromStep(this);
    this.scene.humanScale.updateFromStep(this);

    this.scene.humanScale.updateRendering();
    this.updateSoundsPlayBack(event);

    // if not next step reset all anims
    if(this.previousStep && !this.isNextStep()) {
      console.log('modelAnimationManager stop all');
      ModelAnimationManager.stopCurrent();
    }    

    Bus.dispatch("step:display", this);
    this.dispatch("display");
  }

  hide(){
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
    return this.rank - 1 === this.previousStep.rank;
  }

  /**
   * Raf method
   * @abstract
   */
  loop() {
  }
}

export default Step;
