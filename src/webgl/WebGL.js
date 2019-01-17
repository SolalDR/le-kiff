import { MicroScale, HumanScale, MacroScale} from "./components/Scale/index";
import {AnimationManager, ControllerManager, InfoManager} from "./manager";

import * as THREE from "three";
import Clock from "./helpers/Clock";
import renderer from "./rendering/Renderer";
import MouseCaster from "./components/MouseCaster";
import Chapters from "./steps";
import History from "./steps/History";
import Viewport from "~/helpers/Viewport";
import {guiRendering} from "~/services/gui"
import Bus from "../helpers/Bus";
import ConfigManager from "../services/ConfigManager";
import defaultConfig from "./steps/config";

class WebGL {

  constructor({
    element = null
  } = {}){
    Bus.verbose("webgl:init");

    this.resolution =  new THREE.Vector2(Viewport.width, Viewport.height);
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x111111);
    this.clock = new Clock();
    this.camera = new THREE.PerspectiveCamera( 60, Viewport.ratio, 0.1, 1000 );
    this.renderer = renderer;
    this.camera.position.copy(new THREE.Vector3(0, 0, 8));
    InfoManager.setCamera(this.camera);
    InfoManager.setScene(this.threeScene);
    
    this.renderer.init({ 
      scene: this.threeScene,  
      camera: this.camera, 
      element: element 
    });
    
    this.mouseCaster = new MouseCaster({
      root: this.threeScene
    });

    this.controllerManager = new ControllerManager({
      camera: this.camera, 
      mouseCaster: this.mouseCaster
    })

    ConfigManager.updateConfig(defaultConfig);
    this.microScale = new MicroScale({ scene: this });
    this.macroScale = new MacroScale({ scene: this });
    this.humanScale = new HumanScale({ scene: this }); 
    
    this.state = {
      currentScale: "human",
      previousScale: "human"
    };

    this.render();
  }

  /**
   * Select and display a step
   * @param { { id, chapter_id, datas }} step 
   */
  selectStep(step) {
    // get correct step contructor
    console.log(step);
    var Step = Chapters[step.chapter_rank - 1][step.rank - 1];
    
    if( !Step ) {
      console.error(`Scene.js: There is no Step for ${step}`);
      return;
    }

    if( this.step ){

      var previousStep = this.step;

      var newStep = History.getStep(step.id);
      if( !newStep ){
        newStep = new Step({
          scene: this,
          datas: step
        });
        History.registerStep(newStep);
      }

      // Asynchronous hide with display callback
      this.step.once( 'hide', () => {
        this.step = newStep;
        this.step.init( previousStep );
      })

      this.step.hide( newStep );
      return;
    }

    // First step displayed
    this.step = new Step({
      scene: this,
      datas: step
    });

    this.step.init();

    History.registerStep(this.step);
    

    this.humanScale.display( "micro" );
    
    this.loop();
  }

  /**
   * @param {string} name Name of scale
   */
   selectScale = (name) => {
    if( name !== this.state.currentScale ){

      var currentScale = this.state.currentScale;
      this[currentScale + "Scale"].hide(currentScale, name);
      this[currentScale + "Scale"].once("hide", ()=>{
        this[name + "Scale"].display(currentScale, name);
      })

      this.state.previousScale = currentScale;
      this.state.currentScale = name;
    }
  }

  render(){
    this.light = new THREE.PointLight(0xffffff, 1.3);
    this.light.position.x = 5;
    this.light.position.z = 5;
    this.light.position.y = 5;
    this.threeScene.add(this.light);

    this.light2 = new THREE.PointLight(0xffffff, 1);
    this.light2.position.x = -5;
    this.light2.position.z = -5;
    this.light2.position.y = -5;
    this.threeScene.add(this.light2);

    guiRendering.addLight("Light Primary", this.light);
    guiRendering.addLight("Light Secondary", this.light2);
  }

  loop = () => {
    this.clock.update();

    this[this.state.currentScale+"Scale"].loop(this.clock.elapsed);
    this.mouseCaster.render();
    this.controllerManager.update();

    InfoManager.update();
    AnimationManager.renderAnimations(this.clock.delta);

    this.renderer.render();

    requestAnimationFrame(this.loop);
  }

}

export default WebGL;
