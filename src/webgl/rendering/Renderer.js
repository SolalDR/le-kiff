import EffectComposer, {RenderPass} from "@johh/three-effectcomposer";
import UnrealBloomPass from "./Pass/UnrealBloomPass";
import BokehPass from "./Pass/bokeh";
import {guiRendering} from "~/services/gui";
import Viewport from "~/helpers/Viewport";
import config from './config';
import {Brownian} from "noisadelic";
import Water from "../components/Water";

class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ 
      gammaOutput: true,
      gammaInput: true 
    });
    this.composer = new EffectComposer( this.renderer );
    this.composer.setSize( Viewport.width, Viewport.height );
    this.render = this.composer.render.bind(this.composer);
    this.renderer.setSize( Viewport.width, Viewport.height );   
    this.renderer.setPixelRatio(2);

    guiRendering.add(this.renderer, "toneMappingExposure").min(-3).max(3)
    guiRendering.add(this.renderer, "toneMappingWhitePoint").min(-3).max(3)
  }

  init({
    scene, 
    camera, 
    renderer,
    element
  } = {}){
    this.scene = scene;
    this.camera = camera;
    guiRendering.add(this.camera, "far").min(0).max(1000).onChange(() => {
      this.camera.updateProjectionMatrix ()
    })
    guiRendering.add(this.camera, "near").min(0).max(1000).onChange(() => {
      this.camera.updateProjectionMatrix ()
    })


    element.appendChild(this.renderer.domElement);

    //this.initLights();
    this.initPostprocess();
    this.initEvents();
    this.initNoise();
    this.initWater();
  }

  initWater(){
    this.water = new Water({ renderer: this.renderer });
  }

  initNoise(){
    this.noise = new THREE.Texture(new Brownian({rgb: true}).convertImage());
    this.noise.wrapS = THREE.RepeatWrapping;
    this.noise.wrapT = THREE.RepeatWrapping;
    this.noise.repeat.x = 512;
    this.noise.repeat.y = 512;
    this.noise.needsUpdate = true;
  }

  initPostprocess(){
    this.initBloom();
    this.initBokeh();
    
    var renderScene = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderScene );
    this.composer.addPass( this.bloomPass );
    this.composer.addPass( this.bokehPass );

    this.bokehPass.renderToScreen = true;
  }


  initBloom(){
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( Viewport.width, Viewport.height ));
    this.bloomPass.setSize(Viewport.width*2, Viewport.height*2);
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 0.3;
    this.bloomPass.radius = 0;

    var bloomFolder = guiRendering.addFolder("Bloom");
    bloomFolder.add(this.bloomPass, "threshold").step(0.01);
    bloomFolder.add(this.bloomPass, "strength").step(0.01);
    bloomFolder.add(this.bloomPass, "radius").step(0.01);
  }

  initBokeh(){
    this.bokehPass = new BokehPass( this.scene, this.camera, {
      focus: 0,
      aperture:	0,
      maxblur: 0,
      width: Viewport.width,
      height: Viewport.height
    });

    var bokehFolder = guiRendering.addFolder("Bokeh");
    bokehFolder.add(this.bokehPass, "focus", -1, 1, 0.001)
    bokehFolder.add(this.bokehPass, "aperture", 0, 1, 0.001)
    bokehFolder.add(this.bokehPass, "maxblur", 0.0, 10.0, 0.001)

  }

  /**
   * init scene lights
   * to call them : this.light[*light key in config*] 
   */
  initLights() {
    // init lights object
    this.lights = {}

    // create lights 
    Object.entries(config.light).forEach(([key, config]) => {

      // create default light
      const light = new THREE.PointLight(0xffffff, 1);
      // assign parameters
      Object.entries(config).forEach(([key, value]) => {
        if(value instanceof THREE.Vector3 || value instanceof THREE.Euler) {
          light[key].copy(value);
        } else {
          light[key] = value;
        }
      });
      this.scene.add(light);
      guiRendering.addLight(config.name, light);
      this.lights[key] = light;
    });
  }

  initEvents(){
    Viewport.on("resize", ()=>{
      this.camera.aspect = Viewport.ratio;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( Viewport.width, Viewport.height );
      this.bokehPass.setSize( Viewport.width, Viewport.height );
      this.composer.setSize( Viewport.width, Viewport.height );
    })
  }

  getBokehFocus(){ return this.bokehPass.focus; }
  getBokehAperture(){ return this.bokehPass.aperture; }

  /**
   * Postprocess setter bokeh
   * @param {Number} value 
   */
  setBokehFocus(value){
    this.bokehPass.focus = value;
  }

  /**
   * Postprocess setter bokeh
   * @param {Number} value 
   */
  setBokehAperture(value) {
    this.bokehPass.aperture = value;
  }

  /**
   * Postprocess setter bokeh
   * @param {Number} value 
   */
  setBokehMaxblur(value) {
    this.bokehPass.maxblur = value;
  }

  /**
   * Postprocess setter bloom
   * @param {Number} value 
   */
  setBloomIntensity(value){
    this.bloomPass.strength = value;
  }

  /**
   * Postprocess setter bloom
   * @param {Number} value 
   */
  setBloomThreshold(value) {
    this.bloomPass.threshold = value;
  }

  /**
   * Postprocess setter bloom
   * @param {Number} value 
   */
  setBloomRadius(value) {
    this.bloomPass.radius = value;
  }

  /**
   * Postprocess setter bloom
   * @param {Number} value 
   */
  setToneMappingExposure(value) {
    this.renderer.toneMappingExposure = value;
  }

  intensity(value){
    this.bloomPass.strength = value;
  }

}

export default new Renderer();
