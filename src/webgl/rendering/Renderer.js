import * as THREE from "three";
import EffectComposer, {RenderPass} from "@johh/three-effectcomposer"
import UnrealBloomPass from "./UnrealBloomPass";
import gui from "~/services/gui";

class Renderer {
  constructor() {
    this.gui = gui.addFolder("Renderer");
    this.renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true });
    this.composer = new EffectComposer( this.renderer );
    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.render = this.composer.render.bind(this.composer);
    this.renderer.setSize( window.innerWidth, window.innerHeight );    
  }

  init({
    scene, 
    camera, 
    renderer,
    element
  } = {}){
    this.scene = scene; 
    this.camera = camera;
    element.appendChild(this.renderer.domElement);

    this.initPostprocess();
    this.initEvents();
  }

  initPostprocess(){
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ));
    this.bloomPass.setSize(window.innerWidth*2, window.innerHeight*2);
    this.bloomPass.renderToScreen = true;
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 0.3;
    this.bloomPass.radius = 0;

    var bloomFolder = this.gui.addFolder("Bloom");
    bloomFolder.add(this.bloomPass, "threshold").step(0.01);
    bloomFolder.add(this.bloomPass, "strength").step(0.01);
    bloomFolder.add(this.bloomPass, "radius").step(0.01);
    
    var renderScene = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderScene );
    this.composer.addPass( this.bloomPass );
  }

  initEvents(){
    window.addEventListener("resize", ()=>{
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    })
  }

  intensity(value){
    this.bloomPass.strength = value;
  }

}

export default new Renderer();