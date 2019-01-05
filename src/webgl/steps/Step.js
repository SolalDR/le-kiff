import Event from "~/helpers/Event";
import PointManager from "~/webgl/components/Point/PointManager";

/**
 * @class
 */
class Step extends Event {

  /**
   * @constructor
   * @param {Scene} scene
   * @param {Object} datas 
   * @param {[string]} availableScale
   * @param {[Point]} points A list of point See ~/webgl/components/point/Point.js
   */
  constructor({
    scene = null,
    datas = {}
  } = {}){
    super();
    this.scene= scene;
    // TODO Replace with datas.rank 
    this.id = datas.id;
    this.chapter_id = datas.chapter_id;
    this.content = datas.content;
    this.infos = datas.infos;
  }

  manageInfos(infos){

  }

  display() {
    this.dispatch("display");
  }

  hide(){
    this.dispatch("hide");
  }
}

export default Step;
