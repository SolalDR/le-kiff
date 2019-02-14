import Event from "~/helpers/Event";
import AnimationManager, {Animation, Mixer} from "~/webgl/manager/Animation";
import renderer from "~/webgl/rendering/Renderer";
import SoundManager from "~/services/soundManager/SoundManager";
import Bus from "~/helpers/Bus";
import ConfigManager from "~/services/ConfigManager";
import AbilitiesManager from "../../../services/AbilitiesManager";

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
      Bus.verbose("scale-" + this.name + ":display", 2);
      AbilitiesManager.can("all", true);
    }));

    return {
      cameraAnim, 
      postprocessAnim: postprocessAnimData.animation
    }
  }

  updateRendering({
    animate = false,
    duration = 3000
  } = {}){
    var c = this.config.rendering;

    this.scene.renderer.setToneMappingExposure(c.toneMappingExposure);
    this.scene.renderer.setBloomRadius(c.bloom.radius);
    this.scene.renderer.setBloomThreshold(c.bloom.threshold);
    this.scene.renderer.setBloomIntensity(c.bloom.strength);
    this.scene.renderer.setBokehAperture(c.bokeh.aperture);
    this.scene.renderer.setBokehFocus(c.bokeh.focus);
    this.scene.renderer.setBokehMaxblur(c.bokeh.maxblur);

    
    if( !animate ) {
      this.scene.lightPrimary.position.copy(c.light.primary.position);
      this.scene.lightSecondary.position.copy(c.light.secondary.position);
      this.scene.lightPrimary.intensity = c.light.primary.intensity;
      this.scene.lightSecondary.intensity = c.light.secondary.intensity;
      this.scene.lightAmbient.intensity = c.light.ambient.intensity;
      this.scene.lightPrimary.color = c.light.primary.color;
      this.scene.lightSecondary.color = c.light.secondary.color;
      this.scene.lightAmbient.color = c.light.ambient.color;
      return; 
    }
    
    var animates = [];

    // Light position
    if(!this.scene.lightPrimary.position.equals(c.light.primary.position)) 
      animates.push({ type: "vector3", object: this.scene.lightPrimary.position, from: this.scene.lightPrimary.position.clone(), to: c.light.primary.position });
    if(!this.scene.lightSecondary.position.equals(c.light.secondary.position)) 
      animates.push({ type: "vector3", object: this.scene.lightSecondary.position, from: this.scene.lightSecondary.position.clone(), to: c.light.secondary.position });
    
    // Light intensity
    if(this.scene.lightSecondary.intensity !== c.light.secondary.intensity)
      animates.push({ type: "float", attribute: "intensity", object: this.scene.lightSecondary, from: this.scene.lightSecondary.intensity, to: c.light.secondary.intensity });
    if(this.scene.lightPrimary.intensity !== c.light.primary.intensity)
      animates.push({ type: "float", attribute: "intensity", object: this.scene.lightPrimary, from: this.scene.lightPrimary.intensity, to: c.light.primary.intensity });
    if(this.scene.lightAmbient.intensity !== c.light.ambient.intensity)
      animates.push({ type: "float", attribute: "intensity", object: this.scene.lightAmbient, from: this.scene.lightAmbient.intensity, to: c.light.ambient.intensity });

    // Light color
    if(!this.scene.lightSecondary.color.equals(c.light.secondary.color))
      animates.push({ type: "color", object: this.scene.lightSecondary.color, from: this.scene.lightSecondary.color.clone(), to: c.light.secondary.color });
    if(!this.scene.lightPrimary.color.equals(c.light.primary.color))
      animates.push({ type: "color", object: this.scene.lightPrimary.color, from: this.scene.lightPrimary.color.clone(), to: c.light.primary.color });
    if(!this.scene.lightAmbient.color.equals(c.light.ambient.color))
      animates.push({ type: "color", object: this.scene.lightAmbient.color, from: this.scene.lightAmbient.color.clone(), to: c.light.ambient.color });


    AnimationManager.addAnimation(new Animation({duration})
      .on("progress", (event) => {
        animates.forEach(item => {
          let value = (Mixer[item.type])(item.from, item.to, event.advancement, item.object)
          if( item.attribute ){
            item.object[item["attribute"]] = value;
          }
        })
      })
      .on("end", () => {
        animates.forEach(item => {
          (Mixer[item.type])(item.from, item.to, 1, item.object)
        })
      })
    )
  }

  hideAnimate( config ){
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
  }

  hide( config, animate = true ){
    AbilitiesManager.can("all", false);
    Bus.dispatch("scale:hidding", this);
    if( animate ){
      this.hideAnimate(config);
      return;
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
    // if no sounds in config return
    if(!config.sound) return;

    // set volume
    if(config.sound.volume) {
        SoundManager.volume = config.sound.volume;
    } else {
        SoundManager.volume = SoundManager.defaultVolume;
    }

    // set sound effect
    if(config.sound.effect) {
      const methodName = transitionType === 'display' ? 'addEffect' : transitionType === 'hide' ? 'removeEffect' : null;
      config.sound.effect.list.forEach(effectName => {
        SoundManager[methodName](effectName);
      });
    } else if(transitionType === 'hide') {
      SoundManager.removeAllEffects();
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
