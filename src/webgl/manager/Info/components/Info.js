import Event from "~/helpers/Event";
import Viewport from "~/helpers/Viewport"
import Bus from "../../../../helpers/Bus";
import GeoCoord from "~/webgl/helpers/geo/GeoCoord";

/**
 * Represent the link with a react infos
 */
class Info extends Event{

  /**
   * @constructor
   * @param {Object} info The props info passed from Scene.jsx => Scene.js => InfoManager
   * @param {THREE.Object3D} object3D Represent the 3D object
   */
  constructor(info, object3D = null){
    super();
    this.id = info.id;
    this.object3D = object3D;
    this.position = new THREE.Vector3(info.attachment.position.x, info.attachment.position.y, info.attachment.position.z);
    this.normal = new THREE.Vector3();
    this.datas = info;

    if(info.attachment.gps_coordinates && (info.attachment.gps_coordinates.lat !== 0 || info.attachment.gps_coordinates.lon !== 0)){
      var geocoord = new GeoCoord(info.attachment.gps_coordinates.lat, info.attachment.gps_coordinates.lon);
      this.position = geocoord.getCartesianCoord(3);
    }
    

    this.state = {
      screenPosition: new THREE.Vector2(),
      previousVector: new THREE.Vector3(),
      opened: false
    };
  }

  /**
   * Callback React Info.jsx
   */
  click(opened){
    if( opened && !this.state.opened ){
      this.state.opened = true;
      Bus.dispatch(`info:open-${this.datas.scale}-${this.datas.attachment.type}`, {
        info: this
      }, 4)
      return;
    }
    
    if( !opened && this.state.opened ){
      this.state.opened = false;
      Bus.dispatch(`info:close-${this.datas.scale}-${this.datas.attachment.type}`, {
        info: this
      }, 4)
    }
  }

  /**
   * @param {THREE.Camera} camera
   */
  updateScreenCoordinate(camera) {
    const vector = new THREE.Vector3();
    if( this.object3D ) vector.setFromMatrixPosition(this.object3D.matrixWorld)
    
    vector.add(this.position);

    if( this.object3D ) vector.applyEuler(this.object3D.rotation)

    vector.project(camera);

    Viewport.transformUnit(vector, this.state.screenPosition);

    if(!this.state.previousVector.equals(vector)) {
      this.state.previousVector.copy(vector);
      return this.state.screenPosition;
    }
    
    return null;
  }

}

export default Info;
