import * as THREE from "three";
import Event from "~/helpers/Event";
import AnimationManager from "./../../AnimationManager";
import Animation from "~/helpers/Animation";

class Scale extends Event {

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
    super();
    this.scene = scene; 
    this.group = new THREE.Group();
    this.group.name = name;
    this.name = name;

    if( visibility === 0 ) this.group.visible = false;
  }
  
  /**
   * Init three.js part
   * @abstract
   */
  init(){
    this.scene.threeScene.add(this.group);
  }

  /**
   * This abstract method wrap scale transition logic.
   * It decompose animation in two parts : 
   *  - Camera moving
   *  - Postprocessing
   * @param {See /webgl/config.js} config 
   * @returns {cameraAnim: Animation, postprocessAnim: Animation} Return the two anim you can modify in the extended scales
   */
  display( config ){
    this.group.visible = true;
    this.scene.postprocess.intensity(10);


    this.scene.camera.position.copy(config.display.startPosition);
    this.scene.camera.lookAt(config.display.startTarget);
    
    var cameraAnim = this.scene.controllerManager.controls.rails.moveTo(config.display.endPosition, {
      duration: config.display.duration
    });

    this.scene.controllerManager.controls.rails.lookTo(config.display.endTarget, {
      duration: config.display.duration
    });

    var postprocessAnimData = AnimationManager.addAnimation(new Animation({
      duration: config.display.durationPostprocess 
    }).on("progress", ( event ) => {
      this.scene.postprocess.intensity( config.postprocess.bloom.max - event.advancement * config.postprocess.bloom.diff );
    }));

    return {
      cameraAnim, 
      postprocessAnim: postprocessAnimData.animation
    }
  }

  hide( config ){
    var cameraAnim = this.scene.controllerManager.controls.rails.moveTo(config.display.startPosition, {
      duration: config.display.duration
    })

    this.scene.controllerManager.controls.rails.lookTo(config.display.startTarget, {
      duration: config.display.duration
    });

    this.scene.postprocess.intensity(config.postprocess.bloom.min);
    var postprocessAnimData = AnimationManager.addAnimation(new Animation({
        duration: config.display.durationPostprocess, 
        delay: config.display.duration - config.display.durationPostprocess
      }).on("progress", ( event ) => {
        this.scene.postprocess.intensity( 
          config.postprocess.bloom.min + event.advancement * config.postprocess.bloom.diff
        );
      })
    );

    cameraAnim.on("end", ()=>{
      this.dispatch("hide");
      this.group.visible = false;
    });
    
    return {
      cameraAnim,
      postprocessAnim: postprocessAnimData.animation
    }
  }
  

  /**
   * Raf method to calculate the intensity visibility
   * @abstract
   */
  loop() {
    //  ... So lonely
  }
}

export default Scale;
