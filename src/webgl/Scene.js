import MicroScale from "./components/Scale/MicroScale";
import HumanScale from "./components/Scale/HumanScale";
import MacroScale from "./components/Scale/MacroScale";

import * as THREE from "three";
import OrbitControls from 'orbit-controls-es6';

class Scene {

  constructor({
    element = null
  } = {}){

    this.element = element;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera);
    this.microScale = new MicroScale({ scene: this.scene, visibility: 0 });
    this.macroScale = new MacroScale({ scene: this.scene, visibility: 0 });
    this.humanScale = new HumanScale({ scene: this.scene, visibility: 1 });
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

    this.scene.background = new THREE.Color(0xf2f3ee);
    this.camera.position.z = 5;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.initEvents();

    this.render();
    this.loop();
  }

  /**
   * @param {string} name Name of scale
   */
   selectScale = (name) => {
    if( name !== this.state.currentScale ){
      if( name === "macro" ) this.scene.background = new THREE.Color(0x111111);
      this[this.state.currentScale + "Scale"].updateScale(name, this.state.currentScale);
      this[name + "Scale"].updateScale(name, this.state.currentScale);

      this.state.previousScale = this.state.currentScale;
      this.state.currentScale = name;
    }
  }


  render(){
    var light = new THREE.PointLight();
    light.position.z = 5;
    light.position.y = 5;
    this.scene.add(light);

    var light2 = new THREE.PointLight();
    light2.position.x = 10;
    light2.position.z = 10;
    this.scene.add(light2);
  }

  loop = () => {
    this.microScale.loop();
    this.macroScale.loop();
    this.humanScale.loop();
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame(this.loop);
  }

  initEvents(){
    window.addEventListener("resize", ()=>{
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    })
  }
}

export default Scene;
