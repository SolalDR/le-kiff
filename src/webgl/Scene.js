import MicroScale from "./components/Scale/Micro/MicroScale";
import HumanScale from "./components/Scale/Human/HumanScale";
import MacroScale from "./components/Scale/Macro/MacroScale";
import AnimationManager from "./AnimationManager";
import * as THREE from "three";
import ControllerManager from './camera/ControllerManager';
import Clock from "./helpers/Clock";
import gui from "~/services/gui";
import InfoManager from "./components/Info/InfoManager";
import renderer from "./rendering/Renderer";
import MouseCaster from "./components/MouseCaster";
import Chapters from "./steps";
import History from "./steps/History";
import Viewport from "~/helpers/Viewport";

class Scene {

  constructor({
    element = null
  } = {}){
    this.resolution =  new THREE.Vector2(Viewport.width, Viewport.height);
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x111111);
    this.clock = new Clock();
    this.camera = new THREE.PerspectiveCamera( 60, Viewport.ratio, 0.1, 1000 );
    this.renderer = renderer;
    this.renderer.init({ scene: this.threeScene,  camera: this.camera, element: element });
    this.camera.position.copy(new THREE.Vector3(0, 0, 8));
    InfoManager.setCamera(this.camera);
    InfoManager.setScene(this.renderer.scene);

    this.mouseCaster = new MouseCaster({
      root: this.threeScene
    });

    this.controllerManager = new ControllerManager({
      camera: this.camera, 
      mouseCaster: this.mouseCaster
    });

    this.microScale = new MicroScale({ scene: this });
    this.macroScale = new MacroScale({ scene: this });
    this.humanScale = new HumanScale({ scene: this });
    this.humanScale.display( "micro" );
    
    this.points = []; // TODO: add to pointsManager
    this.state = {
      currentScale: "human",
      previousScale: "human"
    };

    this.render();
    this.loop();
    window.scene = this;
  }

  /**
   * Select and display a step
   * @param { { id, chapter_id, datas }} step 
   */
  selectStep(step) {
    // TODO Replace with datas.rank
    // TODO Replace chapters[0] with rank
    // get correct step contructor
    var Step = Chapters[0][step.rank - 1];
    
    if( !Step ) {
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

  updateInfos(infos) {
    InfoManager.updateInfos(infos);
  }

  render(){
    var light = new THREE.PointLight(0xffffff, 3.5);
    light.position.x = 5;
    light.position.z = 5;
    light.position.y = 5;
    this.threeScene.add(light);

    gui.addLight("Light 1", light);
  }

  loop = () => {
    this.clock.update();

    this.microScale.loop();
    this.macroScale.loop();
    this.humanScale.loop();

    if(this.points.length > 0) {
      for (let i = 0; i < this.points.length; i++) {
        this.points[i].loop();
      }
    }

    this.mouseCaster.render();
    this.controllerManager.update();

    InfoManager.update();
    AnimationManager.renderAnimations(this.clock.delta);

    this.renderer.render();

    requestAnimationFrame(this.loop);
  }

}

export default Scene;
