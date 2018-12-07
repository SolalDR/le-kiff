import MicroScale from "./components/Scale/Micro/MicroScale";
import HumanScale from "./components/Scale/Human/HumanScale";
import MacroScale from "./components/Scale/Macro/MacroScale";
import AnimationManager from "./AnimationManager";
import * as THREE from "three";
import OrbitControls from 'orbit-controls-es6';
import Clock from "./helpers/Clock";
import gui from "~/services/gui";
import Point from "./components/Point/Point";

class Scene {

  constructor({
    element = null
  } = {}){
    this.element = element;
    this.scene = new THREE.Scene();
    this.clock = new Clock();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true });
    this.controls = new OrbitControls(this.camera);
    this.microScale = new MicroScale({ scene: this.scene, visibility: 0, renderer: this.renderer  });
    this.macroScale = new MacroScale({ scene: this.scene, visibility: 0 });
    this.humanScale = new HumanScale({ scene: this.scene, visibility: 1 });
    this.points = []; // TODO: add to pointsManager
    this.state = {};

    this.init();
  }

  init(){
    this.element.appendChild(this.renderer.domElement);

    this.state = {
      currentScale: "human",
      previousScale: "human",
      targetScale: null,
      microVisibility: 0,
      macroVisibility: 0,
      humanVisibility: 1
    };

    this.scene.background = new THREE.Color(0x111111);
    this.camera.position.z = 5;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.initEvents();

    this.render();
    this.loop();
  }

  initEvents(){
    window.addEventListener("resize", ()=>{
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    })
  }

  /**
   * @param {string} name Name of scale
   */
   selectScale = (name) => {
    if( name !== this.state.currentScale ){
      this[this.state.currentScale + "Scale"].updateScale(name, this.state.currentScale);
      this[name + "Scale"].updateScale(name, this.state.currentScale);

      this.state.previousScale = this.state.currentScale;
      this.state.currentScale = name;
    }
  }

  getNewPoint() {
     const newPoint = new Point({ threeScene: this });
    this.points.push(newPoint);
    return newPoint;
  }

  render(){
    var light = new THREE.PointLight(0xffffff, 3.5);
    light.position.x = 5;
    light.position.z = 5;
    light.position.y = 5;
    this.scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 3.5);
    light2.position.x = -5;
    light2.position.y = 5;
    light2.position.z = -5;
    this.scene.add(light2);

    gui.addLight("Light 1", light);
    gui.addLight("Light 2", light2);
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

    AnimationManager.renderAnimations(this.clock.delta);

    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame(this.loop);
  }

}

export default Scene;
