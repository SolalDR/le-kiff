import Event from "../../../helpers/Event";
import * as THREE from "three";

class Point extends Event{

  /**
   *
   * @param {Scene} threeScene
   * @property {THREE.Vector2} screenPos
   * @property {THREE.Object3D} attachedObj
   * @property {THREE.Vector3} normal
   */
  constructor({
                threeScene = null
              }){
    super();
    this.threeScene = threeScene;
    this.screenPos = new THREE.Vector2();
    this.attachedObj = null;
    this.normal = new THREE.Vector3();

    this.init();
  }

  init(){
    // TEMP FIXED OBJ
    this.threeScene.humanScale.on('initScene', () => {
      this.attachedObj = this.threeScene.scene.getObjectByName( "Fracture_Feuille_1__Copy_" );
    })
  }

  determineScreenCoordinate(object) {
    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(object.matrixWorld);
    vector.project(this.threeScene.camera);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const widthHalf = width / 2;
    const heightHalf = height / 2;
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = -( vector.y * heightHalf ) + heightHalf;
    return vector;
  }

  /**
   * Raf method
   * @abstract
   */
  loop() {
    if(this.attachedObj) {
      this.screenPos = this.determineScreenCoordinate(this.attachedObj);
    }
    this.dispatch('positionChanged', {x: this.screenPos.x, y: this.screenPos.y});
  }
}

export default Point;
