import Event from "~/helpers/Event";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import renderer from "~/webgl/rendering/Renderer";
import Bus from "~/helpers/Bus";

class Scale extends Event {

  /**
   * 
   * @param {float} visibility The initial visibility
   * @param {THREE.Scene} scene 
   * @param {string} name micro|macro|human
   * @property {THREE.Group} group 
   */
  constructor({
    // visibility = 1,
    scene = null,
    name = ""
  }){
    super();
    
    this.scene = scene; 
    this.group = new THREE.Group();
    this.group.name = name;
    this.name = name;
    this.group.visible = false;
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
    Bus.dispatch("scale:coming", this);
  
    this.group.visible = true;
    this.scene.renderer.intensity(10);

    var diff = config.postprocess.bloom.max - config.postprocess.bloom.min;

    this.scene.camera.position.copy(config.position.from);
    this.scene.camera.lookAt(config.target.from);
    
    var cameraAnim = this.scene.controllerManager.controls.rails.moveTo(config.position.to, {
      duration: config.duration
    });

    this.scene.controllerManager.controls.rails.lookTo(config.target.to, {
      duration: config.duration
    });

    var postprocessAnimData = AnimationManager.addAnimation(new Animation({
      duration: config.postprocess.duration 
    }).on("progress", ( event ) => {
      renderer.intensity( config.postprocess.bloom.max - event.advancement * diff );
    }).on("end", () => {
      Bus.dispatch("scale:display", this, 1)
      Bus.verbose("scale-" + this.name + ":display", 2)
    }));

    return {
      cameraAnim, 
      postprocessAnim: postprocessAnimData.animation
    }
  }

  hide( config ){
    Bus.dispatch("scale:hidding", this);
    var diff = config.postprocess.bloom.max - config.postprocess.bloom.min;

    var cameraAnim = this.scene.controllerManager.controls.rails.moveTo(config.position.from, {
      duration: config.duration
    })

    this.scene.controllerManager.controls.rails.lookTo(config.target.from, {
      duration: config.duration
    });

    this.scene.renderer.intensity(config.postprocess.bloom.min);
    var postprocessAnimData = AnimationManager.addAnimation(new Animation({
        duration: config.postprocess.duration, 
        delay: config.duration - config.postprocess.duration
      }).on("progress", ( event ) => {
        this.scene.renderer.intensity( 
          config.postprocess.bloom.min + event.advancement*diff
        );
      })
    );

    cameraAnim.on("end", ()=>{
      this.dispatch("hide");
      Bus.dispatch("scale:hide", this);
      Bus.verbose("scale-" + this.name + ":hide", 2)
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
