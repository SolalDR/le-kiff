import SphericalCoord from "~/webgl/helpers/geo/SphericalCoord";
import config from "./../config";

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
    enabled = true
  } = {}){
    this.camera = camera;
    this.type = "radial";
    this.mouseCaster = mouseCaster;
    this.enabled = enabled;
    
    this.config = config.radial.clone();

    this.state = {
      active: false,
      baseCoords: SphericalCoord.fromCartesian(camera.position, origin),
      targetCoords: SphericalCoord.fromCartesian(camera.position, origin),
      coords: SphericalCoord.fromCartesian(camera.position, origin),
      radius: camera.position.distanceTo(origin)
    }

    this.initEvents();
  }

  updatePosition() {
    this.state.baseCoords = SphericalCoord.fromCartesian(this.camera, this.config.origin);
  }

  get radius() {
    return this.state.radius
  }

  set radius(value) {
    this.state.radius = value;
    this.camera.position.copy(
      this.camera.position
        .clone()
        .sub(this.config.origin)
        .normalize()
        .multiplyScalar(this.state.radius)
    )
  }

  initEvents() {
    this.mouseCaster.on("move", (position)=>{
      this.state.targetCoords.phi = this.state.baseCoords.phi + position.y * this.config.amplitude[1];
      this.state.targetCoords.theta = this.state.baseCoords.theta - position.x * this.config.amplitude[0];
    })
  }

  get target() {
    return new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.camera.quaternion)
      .add(this.camera.position);
  }

  get coords() {
    return new THREE.Vector3(

    )
  }

  start(){
    this.state.active = true;
  }

  stop(){
    this.state.active = false;
  }

  computeTarget(phi = this.phi, theta = this.theta) {
    var targetPosition = new THREE.Vector3();
    targetPosition.x = this.camera.position.x + 0.5 * Math.sin( phi ) * Math.cos( theta );
    targetPosition.y = this.camera.position.y + 0.5 * Math.cos( phi );
    targetPosition.z = this.camera.position.z + 0.5 * Math.sin( phi ) * Math.sin( theta );
    return targetPosition;
  }

  update() {
    if( !this.state.active ) {
      return;
    }
    this.state.radius = this.camera.position.distanceTo(this.config.origin);
    this.state.coords.phi += (this.state.targetCoords.phi - this.state.coords.phi)*this.config.factor;
    this.state.coords.theta += (this.state.targetCoords.theta - this.state.coords.theta)*this.config.factor;
    this.state.coords.getCartesianCoord(this.state.radius, this.camera.position);
    this.camera.lookAt(this.config.origin);
  }
}

export default RadialControl;
