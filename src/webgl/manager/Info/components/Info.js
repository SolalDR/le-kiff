import Event from "~/helpers/Event";
import Viewport from "~/helpers/Viewport"
import * as THREE from "three";

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
    this.state = {
      screenPosition: new THREE.Vector2(),
      previousVector: new THREE.Vector3()
    };
  }

  /**
   * @param {THREE.Camera} camera
   */
  updateScreenCoordinate(camera) {
    const vector = new THREE.Vector3();
    if( this.object3D ) vector.setFromMatrixPosition(this.object3D.matrixWorld)
    
    vector.add(this.position);
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
