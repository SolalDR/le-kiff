import Event from "~/helpers/Event";
import InfoManager from "~/webgl/components/Info/InfoManager";
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
    
    this.gui = gui.addFolder(`Chapter ${this.chapter_id} Step ${this.rank}`);
  }

  manageInfos(infos){

  }

  init(){
    this.dispatch("init");
  }

  display() {
    this.dispatch("display");
  }

  hide(){
    this.dispatch("hide");
  }
}

export default Step;
