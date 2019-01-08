import Event from "~/helpers/Event";
import Info from "./Info";

class InfoManager extends Event {

  /**
   * @constructor
   * @param {THREE.Camera} camera
   * @param {THREE.Vector2} resolution
   */
  constructor(){
    super();
    this.infos = new Map();
  }

  setCamera(camera){
    this.camera = camera;
  }

  updateInfos(infos){
    infos.forEach((info) => {
      if( !this.infos.get(info.id) ) {
        this.addInfo(info);
      }
    });

    this.infos.forEach(info => {
      if( !infos.find(info => info.infoId === info.id) ) {
        this.removeInfo(info.infoId);
      }
    });

    this.dispatch("update:infos", this.infos);
  }

  addInfo(info){
    this.infos.set(info.id, new Info(info));
  }

  removeInfo(id){
    this.infos.delete( id );
  }

  update(){
    var infoNeedsUpdate = new Map();
    this.infos.forEach(info => {
      var needUpdate = info.updateScreenCoordinate(null, this.camera);
      if(needUpdate){
        infoNeedsUpdate.set(info.id, needUpdate);
      }
    })

    

    if(infoNeedsUpdate.size){
      this.dispatch("infos:update", infoNeedsUpdate);
    }
  }
}

export default new InfoManager();
