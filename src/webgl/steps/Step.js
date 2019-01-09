import Event from "~/helpers/Event";
import Bus from "~/helpers/Bus";
import gui from "~/services/gui";


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
    this.chapter_id = datas.chapter_id;
    this.content = datas.content;
    this.infos = datas.infos;
    
    this.state = {
      initialised: false
    }

    this.gui = gui.addFolder(`Chapter ${this.chapter_id} Step ${this.rank}`);
  }

  manageInfos(infos){

  }

  init(){
    this.state.initialised = true;
    Bus.dispatch("step:init", this);
    this.dispatch("init");
  }

  display() {
    Bus.dispatch("step:display", this);
    this.dispatch("display");
  }

  hide(){
    Bus.dispatch("step:hide", this);
    this.dispatch("hide");
  }
}

export default Step;
