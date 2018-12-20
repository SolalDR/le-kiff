import * as THREE from "three";

class ParalaxControl {
  constructor({
    camera = null,
    direction = new THREE.Vector3(0, 0, -1),
    mouseCaster = null
  } = {}){
    this.camera = camera;
    this.type = "paralax";
    this.mouseCaster = mouseCaster;
    this.state = {
      phi: 0, 
      theta: 0,
      target: this.target
    }
  }

  get target() {
    return new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.camera.quaternion)
      .add(this.camera.position);
  }

  computeTarget(phi = this.phi, theta = this.theta){
    var targetPosition = new THREE.Vector3();
    var factor = 0.5;
    targetPosition.x = this.camera.position.x + factor * Math.sin( phi ) * Math.cos( theta );
    targetPosition.y = this.camera.position.y + factor * Math.cos( phi );
    targetPosition.z = this.camera.position.z + factor * Math.sin( phi ) * Math.sin( theta );
    return targetPosition;
  }

  updateTarget(){
    var phi = this.phi + this.mouse.y/50;
    var theta = this.theta + this.mouse.x/50;
    this.target = this.computeTarget(phi, theta);
  }

  update(){

  }
}

export default ParalaxControl;
