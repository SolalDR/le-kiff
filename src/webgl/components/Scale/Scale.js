import Event from "~/helpers/Event";
import AnimationManager, {Animation} from "~/webgl/manager/Animation";
import renderer from "~/webgl/rendering/Renderer";
import SoundManager from "~/services/soundManager/SoundManager";
import Bus from "~/helpers/Bus";
import ConfigManager from "~/services/ConfigManager";

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
    this.config = ConfigManager.config[name];
    this.scene = scene; 
    this.group = new THREE.Group();
    this.group.name = name;
    this.name = name;
    this.group.visible = false;
    this.initialized = false;
  }
  
  /**
   * Init three.js part
   * @abstract
   */
  init(){
    this.scene.threeScene.add(this.group);
    this.initialized = true;
  }

  initEvents(){
    this.on("display", () => this.onDisplay())
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
    
    this.scene.renderer.setBloomRadius(config.postprocess.bloom.radius.from);
    this.scene.renderer.setBloomThreshold(config.postprocess.bloom.threshold.from);
    this.scene.renderer.setBloomIntensity(config.postprocess.bloom.threshold.from);

    this.scene.renderer.setBokehAperture(config.postprocess.bokeh.aperture.from);
    this.scene.renderer.setBokehFocus(config.postprocess.bokeh.focus.from);
    this.scene.renderer.setBokehMaxblur(config.postprocess.bokeh.maxblur.from);

    var diff = config.postprocess.bloom.strength.from - config.postprocess.bloom.strength.to;

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
      renderer.setBloomIntensity(config.postprocess.bloom.strength.from - event.advancement * diff);      
    }).on("end", () => {
      this.dispatch("display");
      this.updateSound(config, 'display');
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
    var diff = config.postprocess.bloom.strength.from - config.postprocess.bloom.strength.to;

    var cameraAnim = this.scene.controllerManager.controls.rails.moveTo(config.position.from, {
      duration: config.duration
    })

    this.scene.controllerManager.controls.rails.lookTo(config.target.from, {
      duration: config.duration
    });

    this.scene.renderer.setBloomIntensity(config.postprocess.bloom.strength.to);
    var postprocessAnimData = AnimationManager.addAnimation(new Animation({
        duration: config.postprocess.duration, 
        delay: config.duration - config.postprocess.duration
      }).on("progress", ( event ) => {
        this.scene.renderer.setBloomIntensity( config.postprocess.bloom.strength.to + event.advancement*diff );
      })
    );

    cameraAnim.on("end", ()=>{
      this.dispatch("hide");
      Bus.dispatch("scale:hide", this);
      Bus.verbose("scale-" + this.name + ":hide", 2)
      this.group.visible = false;
      this.updateSound(config, 'hide');
    });

    return {
      cameraAnim,
      postprocessAnim: postprocessAnimData.animation
    }
  }

  onDisplay(){

  }

  /**
   * Update sounds parameters from config
   * @param {See /webgl/config.js} config 
   * @param {String} transitionType Can be 'display' or 'hide' - control sound on transition  
   */
  updateSound( config, transitionType ) {
    if(!config.sound) return;
    if(config.sound.volume) {
        SoundManager.volume = config.sound.volume;
    } else {
        SoundManager.volume = SoundManager.defaultVolume;
    }
    if(config.sound.effect) {
      const methodName = transitionType === 'display' ? 'addEffect' : transitionType === 'hide' ? 'removeEffect' : null;
      config.sound.effect.list.forEach(effectName => {
        SoundManager[methodName](effectName);
      });
    }
  }

  /**
   * Raf method to calculate the intensity visibility
   * @abstract
   */
  loop() {
    
  }
}

export default Scale;
