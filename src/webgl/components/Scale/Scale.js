import * as THREE from "three";

class Scale {

  /**
   * 
   * @param {float} visibility The initial visibility
   * @param {THREE.Scene} scene 
   * @param {string} name micro|macro|human
   * @property {THREE.Group} group 
   */
  constructor({
    visibility = 1,
    scene = null,
    name = ""
  }){
    this.scene = scene; 
    this.group = new THREE.Group();
    this.group.name = name;
    this.name = name;
    this.state = {
      targetVisibility: visibility,
      currentVisibility: visibility, 
      previousScale: "human",
      currentScale: "human",
    };

    if( visibility === 0 ) this.group.visible = false;
  }
  
  /**
   * Init three.js part
   * @abstract
   */
  init(){
    this.group.scale.x = this.state.currentVisibility;
    this.group.scale.y = this.state.currentVisibility;
    this.group.scale.z = this.state.currentVisibility;
    
    this.scene.add(this.group);
  }

  /**
   * Trigger by Scene.js when changing a scale 
   * @param {string} newScale 
   * @param {string} previousScale 
   */
  updateScale(newScale, previousScale){
    this.state.targetVisibility = (this.name === newScale) ? 1 : 0;
    this.state.previousScale = previousScale; 
    this.state.currentScale = newScale;
  }

  /**
   * Raf method to calculate the intensity visibility
   * @abstract
   */
  loop() {
    if( this.state.currentVisibility !== this.state.targetVisibility ){
      this.state.currentVisibility = THREE.Math.clamp(
        this.state.currentVisibility + (this.state.targetVisibility - this.state.currentVisibility)*0.05,
        0, 
        1
      );

      if( !this.group.visible && this.state.currentVisibility > 0 ){
        this.group.visible = true;
      }

      if( this.group.visible && this.state.currentVisibility === 0 ){
        this.group.visible = false;
      }
    }

    return this.group.visible;
  }
}

export default Scale;
