import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";
import * as GUI from "~/services/gui";
import ConfigManager from "~/services/ConfigManager";
import SoundManager from "~/services/soundManager/SoundManager";
import InfoManager from "~/webgl/manager/Info";

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
    this.infos = datas.infos
    
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

  init(config){
    this.config = config;
    this.state.initialised = true;
    Bus.dispatch("step:init", this);
    this.dispatch("init"); 
  }

  display(event) {
    ConfigManager.updateConfig(this.config);
    this.scene.microScale.updateFromStep(this);
    this.scene.macroScale.updateFromStep(this);
    this.scene.humanScale.updateFromStep(this);

    //console.log('step event', event);
    console.log('id', this.id);
    console.log('rank', this.rank);

    this.updateSoundsPlayBack(event);

    Bus.dispatch("step:display", this);
    this.dispatch("display");
  }

  hide(){
    Bus.dispatch("step:hide", this);
    this.dispatch("hide");
  }

  /**
   * Raf method
   * @abstract
   */
  loop() {
  }
}

export default Step;
