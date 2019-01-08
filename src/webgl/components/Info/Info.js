import Event from "../../../helpers/Event";
import * as THREE from "three";
import Viewport from "~/helpers/Viewport"

class Info extends Event{

  /**
   * @constructor
   * @param {int} infoId
   * @param {THREE.Vector3} position
   * @param {THREE.Vector3} normal
   */
  constructor(info){
    super();
    this.id = info.id;
    this.position = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.datas = info;
    this.state = {
      screenPosition: new THREE.Vector2(),
      previousVector: new THREE.Vector3()
    };
  }

  /**
   * @param {THREE.Object3D} attachedObject
   * @param {THREE.Camera} camera
   * @param {THREE.Vector2} resolution
   */
  updateScreenCoordinate(attachedObject = null, camera) {
    const vector = new THREE.Vector3();
    if( attachedObject ) vector.setFromMatrixPosition(attachedObject.matrixWorld)
  
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
