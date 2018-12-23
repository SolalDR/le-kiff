import * as THREE from "three";
import AnimationManager from "./../AnimationManager";
import Animation from "~/helpers/Animation";
import Event from "~/helpers/Event";

/**
 * @class
 * Radial control can rotate arround a point based on radial coord. 
 * The coords are just like geo coords but defining between [-π;π] for theta (azimuth) & [-π/2, π/2] for phi (elevation)
 */
class RailsControl extends Event {
  constructor({
    camera = null
  } = {}){
    super();
    
    this.camera = camera;
    this.type = "rails";

    this.config = {
      animation: {
        duration: 1000,
        timingFunction: "easeInOutQuad" 
      }
    }

    this.state = {
      moveData: null,
      lookData: null
    }
  }

  /**
   * Return true if an anim is currently played
   * @returns {boolean}
   */
  get isActive(){
    return this.state.moveData !== null || this.state.lookData !== null;
  }

  /**
   * Get the position the camera is looking at a given distance
   * @param {float} distance 
   */
  getComputedTarget(distance = 1){
    return new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.camera.quaternion)
      .multiplyScalar(distance)
      .add(this.camera.position)
  }

  /**
   * Move the camera to a certain point
   * @param {THREE.Vector3} target 
   * @param {{speed: {int}, timingFunction: {string}}} arguments
   * @returns {Animation} 
   */
  moveTo(target = new THREE.Vector3(), {
    duration = this.config.animation.duration,
    timingFunction = this.config.animation.timingFunction
  } = {}){

    // Init
    var from = this.camera.position.clone();
    var to = target.clone();
    var diff = to.clone().sub(from);

    // Test if it's a useless anim
    if( from.equals(to) ) return;
    
    // Register animation globally
    this.state.moveData = AnimationManager.addAnimation(new Animation({ duration, timingFunction })
      .on("progress", (event)=>{
        this.camera.position.copy(
          from.clone().add(diff.clone().multiplyScalar(event.advancement))
        );
      })
      .on("end", (event)=>{
        this.dispatch("end:move");
        this.state.moveData = null;
      })
    );
    
    // Emit events
    this.dispatch("start:move", this.state.moveData);
    return this.state.moveData.animation;
  }

  /**
   * Launch a smooth look animation 
   * @param {THREE.Vector3} target 
   * @param {{timingFunction: {string}, duration: {int}}} arguments
   * @returns {Animation}  
   */
  lookTo(target, {
    duration = this.config.animation.duration,
    timingFunction = this.config.animation.timingFunction
  } = {}){

    // Init
    var distance = this.camera.position.distanceTo(target);
    var from = this.getComputedTarget(distance);
    var to = target.clone();
    var diff = to.clone().sub(from);

    // Test if it's a useless anim
    if( from.clone().normalize().equals(to.clone().normalize()) ) return;

    // Register animation globally
    this.state.lookData = AnimationManager.addAnimation(new Animation({ duration, timingFunction })
      .on("progress", (event) => {
        this.camera.lookAt(from.clone().add(diff.clone().multiplyScalar(event.advancement)));
      })
      .on("end", () => {
        this.state.lookData = null;
        this.dispatch("end:look");
      })
    );

    this.dispatch("start:look", this.state.lookData);
    return this.state.lookData.animation;
  }
}

export default RailsControl;
