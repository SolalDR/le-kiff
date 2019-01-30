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
    this.initEvents();
  }

  initEvents(){
    this.on("display", (event) => this.onDisplay(event))
    Bus.on("config:update", ()=>{
      this.config = ConfigManager.config[this.name];
    })
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
  
    this.updateRendering();

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
      this.dispatch("display", { transition: config });
      Bus.dispatch("scale:display", this, 1)
      Bus.verbose("scale-" + this.name + ":display", 2)
    }));

    return {
      cameraAnim, 
      postprocessAnim: postprocessAnimData.animation
    }
  }

  updateRendering(){
    var c = this.config.rendering;

    this.scene.renderer.setToneMappingExposure(c.toneMappingExposure);
    this.scene.renderer.setBloomRadius(c.bloom.radius);
    this.scene.renderer.setBloomThreshold(c.bloom.threshold);
    this.scene.renderer.setBloomIntensity(c.bloom.strength);
    this.scene.renderer.setBokehAperture(c.bokeh.aperture);
    this.scene.renderer.setBokehFocus(c.bokeh.focus);
    this.scene.renderer.setBokehMaxblur(c.bokeh.maxblur);
  
    this.scene.lightPrimary.position.copy(c.light.primary.position);
    this.scene.lightSecondary.position.copy(c.light.secondary.position);

    this.scene.lightPrimary.intensity = c.light.primary.intensity;
    this.scene.lightSecondary.intensity = c.light.secondary.intensity;
    this.scene.lightPrimary.color = c.light.primary.color;
    this.scene.lightSecondary.color = c.light.secondary.color;
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

    this.scene.renderer.setBloomThreshold(0);
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

  /**
   * @abstract
   */
  updateFromStep() {}
  onDisplay(config) {
    this.updateSound(config.transition, 'display');
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
