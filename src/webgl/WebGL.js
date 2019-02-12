import { MicroScale, HumanScale, MacroScale} from "./components/Scale/index";
import {AnimationManager, ControllerManager, InfoManager} from "./manager";
import AssetsManager from "~/services/assetsManager/AssetsManager";

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
import ModelAnimationManager from "./manager/ModelAnimation";
import {init as initChapter1} from "./steps/chapter1"
import AbilitiesManager from "../services/AbilitiesManager";

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
      root: this.threeScene,
      casting: false
    });

    this.controllerManager = new ControllerManager({
      camera: this.camera, 
      mouseCaster: this.mouseCaster
    })

    ConfigManager.updateConfig(defaultConfig);
    this.config = ConfigManager.config;
    this.microScale = new MicroScale({ scene: this });
    this.macroScale = new MacroScale({ scene: this });
    this.humanScale = new HumanScale({ scene: this }); 
    
    this.state = {
      currentScale: "human",
      previousScale: "human",
      scaleWheelChanging: false,
      // TODO Update baseRadius on step/scale change
      baseRadius: this.controllerManager.state.controller.radius,
      targetRadius: this.controllerManager.state.controller.radius
    };

    this.render();

    window.addEventListener("mousewheel", (event)=>{
      if (!AbilitiesManager.can("changeScale")) return;
      if( this.state.scaleWheelChanging ) return;
      if( Math.abs(event.deltaY) < 50 ) { return; }
      
      if( event.deltaY > 0 && this.state.currentScale !== "macro"){
        this.selectScale((this.state.currentScale === "micro" ? "human" : "macro"));
        this.state.scaleWheelChanging = true
        Bus.once("scale:display", _ => this.state.scaleWheelChanging = false)
        this.state.targetRadius = this.state.baseRadius;
        return;
      } else if (event.deltaY < 0 && this.state.currentScale !== "micro"){
        this.selectScale((this.state.currentScale === "macro" ? "human" : "micro"));
        this.state.scaleWheelChanging = true
        Bus.once("scale:display", _ => this.state.scaleWheelChanging = false)
        this.state.targetRadius = this.state.baseRadius;
        return;
      }
    })

    window.scene = this.threeScene;
  }

  /**
   * Select and display a step
   * @param { { id, chapter_id, datas }} step 
   */
  selectStep(step) {
    // get correct step contructor
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
    
    
    // .init(AssetsManager.loader.getFiles("chapter-1"), this.scene);
    // First step displayed
    this.step = new Step({
      scene: this,
      datas: step
    });
    this.step.init();
    History.registerStep(this.step);
    initChapter1(AssetsManager.loader.getFiles("chapter-1"), this)

    this.humanScale.group.visible = true
    this.microScale.group.visible = true
    this.macroScale.group.visible = true
    this.renderer.renderer.render(this.threeScene, this.camera);
    this.microScale.group.visible = false
    this.macroScale.group.visible = false
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
    this.lightPrimary = new THREE.PointLight(0xffffff, 1);
    this.lightPrimary.position.x = 5;
    this.lightPrimary.position.z = 5;
    this.lightPrimary.position.y = 5;
    this.threeScene.add(this.lightPrimary);

    this.lightSecondary = new THREE.PointLight(0xffffff, 0.5);
    this.lightSecondary.position.x = -5;
    this.lightSecondary.position.z = -5;
    this.lightSecondary.position.y = -5;
    this.threeScene.add(this.lightSecondary);

    this.lightAmbient = new THREE.AmbientLight(0xffffff, 1);
    this.threeScene.add(this.lightAmbient);

    guiRendering.addLight("Light Primary", this.lightPrimary);
    guiRendering.addLight("Light Secondary", this.lightSecondary);
    guiRendering.addLight("Light Ambient", this.lightAmbient);
  }

  loop = () => {
    this.clock.update();

    this[this.state.currentScale+"Scale"].loop(this.clock.elapsed);
    this.step.loop(this.clock.elapsed*0.001);
    this.mouseCaster.render();
    this.controllerManager.update();

    InfoManager.update();
    AnimationManager.renderAnimations(this.clock.delta);
    ModelAnimationManager.update(this.clock.delta);

    this.renderer.render();

    requestAnimationFrame(this.loop);
  }

}

export default WebGL;
