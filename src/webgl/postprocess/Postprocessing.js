import * as THREE from "three";
import EffectComposer, {RenderPass} from "@johh/three-effectcomposer"
import UnrealBloomPass from "./UnrealBloomPass";
import gui from "~/services/gui";

class PostProcessing {
  constructor({
    scene, 
    camera, 
    renderer
  }) {

    this.gui = gui.addFolder("postprocessing");


    this.scene = scene; 
    this.camera = camera;
    this.renderer = renderer;

    this.composer = new EffectComposer( this.renderer );
    var renderScene = new RenderPass( this.scene, this.camera );
    this.initBloom();

    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.composer.addPass( renderScene );
    this.composer.addPass( this.bloomPass );
  }

  initBloom(){
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
  }

  initBlur(){
    
  }

  intensity(value){
    this.bloomPass.strength = value;
  }
}

export default PostProcessing;
