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

    this.state = {
      isReady: false
    }
  }

  get isReady() {
    return this.state.isReady
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
    this.state.ready = true;
  }

  /**
   * Update the infos watched
   * @param {*} infos 
   */
  updateInfos(infos){
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

    this.dispatch("update:infos", this.infos);
  }

  /**
   * Add a new info 
   * @param {Info} info 
   */
  addInfo(info){
    this.infos.set(info.id, new Info(info, this.scene.getObjectByName('main-step-1fez')));
  }

  /**
   * Remove an info
   * @param {Info} id 
   */
  removeInfo(id){
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

    if(infoNeedsUpdate.size){
      this.dispatch("infos:update", infoNeedsUpdate);
    }
  }
}

export default new InfoManager();
