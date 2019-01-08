import Event from "~/helpers/Event";
import Info from "./Info";

/**
 * Manage the positions of the Info passed 
 */
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

  /**
   * Set the camera, this method is executed once at initialisation
   * @param {THREE.Camera} camera 
   */
  setCamera(camera){
    this.camera = camera;
  }

  /**
   * Set the scene, this method is executed once at initialisation
   * @param {THREE.Scene} camera 
   */
  setScene(scene){
    this.scene = scene;
  }

  /**
   * Update the infos watched
   * @param {*} infos 
   */
  updateInfos(infos){
    console.log("InfoManager: Update info")
    infos.forEach((info) => {
      if( !this.infos.get(info.id) ) {
        this.addInfo(info);
      }
    });

    this.infos.forEach(info => {
      if( !infos.find(infoTmp => infoTmp.id === info.id) ) {
        this.removeInfo(info.id);
      }
    });
    console.log("Number of info to track", this.infos.size, infos.length === this.infos.size)

    this.dispatch("update:infos", this.infos);
  }

  /**
   * Add a new info 
   * @param {Info} info 
   */
  addInfo(info){
    console.log("----add info", info.id)
    this.infos.set(info.id, new Info(info, this.scene.getObjectByName('main-step-1fez')));
  }

  /**
   * Remove an info
   * @param {Info} id 
   */
  removeInfo(id){
    console.log("----remove info", id)
    this.infos.delete( id );
  }

  /**
   * raf method
   */
  update(){    
    
    var infoNeedsUpdate = new Map();
    this.infos.forEach(info => {
      var infoUpdated = info.updateScreenCoordinate(this.camera);
      if(infoUpdated){
        infoNeedsUpdate.set(info.id, infoUpdated);
      }
    })

    console.log("---update", infoNeedsUpdate.size)

    if(infoNeedsUpdate.size){
      this.dispatch("infos:update", infoNeedsUpdate);
    }
  }
}

export default new InfoManager();
