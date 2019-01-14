import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";
import * as GUI from "~/services/gui";
import ConfigManager from "~/services/ConfigManager";

/**
 * @class
 */
class Step extends Event {

  /**
   * @constructor
   * @param {Scene} scene
   * @param {Object} datas 
   * @param {[string]} availableScale
   * @param {[Info]} points A list of point See ~/webgl/components/point/Point.js
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

  init(config){
    this.config = config;
    this.state.initialised = true;
    Bus.dispatch("step:init", this);
    this.dispatch("init");
  }

  display() {
    ConfigManager.updateConfig(this.config);
    this.scene.microScale.updateFromStep(this);
    this.scene.macroScale.updateFromStep(this);
    
    Bus.dispatch("step:display", this);
    this.dispatch("display");
  }

  hide(){
    Bus.dispatch("step:hide", this);
    this.dispatch("hide");
  }
}

export default Step;
