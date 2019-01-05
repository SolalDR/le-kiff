import * as THREE from "three";
import SphericalCoord from "./../helpers/geo/SphericalCoord";

/**
 * @class
 * Radial control can rotate arround a point based on radial coord. 
 * The coords are just like geo coords but defining between [-π;π] for theta (azimuth) & [-π/2, π/2] for phi (elevation)
 */
class RadialControl {
  constructor({
    camera = null,
    origin = new THREE.Vector3(),
    mouseCaster = null,
    amplitude = [0.3, 0.15],
    enabled = true
  } = {}){
    this.camera = camera;
    this.type = "radial";
    this.mouseCaster = mouseCaster;
    this.enabled = enabled;
    
    this.config = {
      amplitude: amplitude,
      origin: origin
    }

    this.state = {
      baseCoords: SphericalCoord.fromCartesian(camera.position, origin),
      targetCoords: SphericalCoord.fromCartesian(camera.position, origin),
      coords: SphericalCoord.fromCartesian(camera.position, origin),
      radius: camera.position.distanceTo(origin)
    }

    this.initEvents();
  }

  updatePosition(){
    this.state.baseCoords = SphericalCoord.fromCartesian(this.camera, this.origin);
  }

  initEvents(){
    this.mouseCaster.on("move", (position)=>{
      this.state.targetCoords.phi = this.state.baseCoords.phi + position.y * this.config.amplitude[1];
      this.state.targetCoords.theta = this.state.baseCoords.theta - position.x * this.config.amplitude[0];
    })
  }

  get target() {
    return new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.camera.quaternion)
      .add(this.camera.position);
  }

  get coords(){
    return new THREE.Vector3(

    )
  }

  computeTarget(phi = this.phi, theta = this.theta){
    var targetPosition = new THREE.Vector3();
    var factor = 0.5;
    targetPosition.x = this.camera.position.x + factor * Math.sin( phi ) * Math.cos( theta );
    targetPosition.y = this.camera.position.y + factor * Math.cos( phi );
    targetPosition.z = this.camera.position.z + factor * Math.sin( phi ) * Math.sin( theta );
    return targetPosition;
  }

  update(){
    this.state.radius = this.camera.position.distanceTo(this.origin);
    this.state.coords.phi += (this.state.targetCoords.phi - this.state.coords.phi)*0.1;
    this.state.coords.theta += (this.state.targetCoords.theta - this.state.coords.theta)*0.1;
    this.state.coords.getCartesianCoord(this.state.radius, this.camera.position);
    this.camera.lookAt(this.config.origin);
  }
}

export default RadialControl;
