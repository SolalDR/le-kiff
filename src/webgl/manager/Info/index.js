import Event from "~/helpers/Event";
import Info from "./components/Info";
import Bus from "~/helpers/Bus";

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
    Bus.verbose("infos-manager:update")
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
    Bus.verbose("infos-manager: add info " + info.id, 3)
    var object = ( info.attachment && info.attachment.name ) ? this.scene.getObjectByName(info.attachment.name) : null;
    this.infos.set(info.id, new Info(info, object));
  }

  /**
   * Remove an info
   * @param {Info} id 
   */
  removeInfo(id){
    Bus.verbose("infos-manager: remove info " + id, 3)
    this.infos.delete( id );
  }

  /**
   * Attach a 3D object to an info. Use full when the object 3D is created after the infos was added
   * @param {int} id 
   */
  attachObjectFromInfoId(id) {
    var info = this.infos.get(id)
    if (info) {

    }
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

export { Info }
export default new InfoManager();
