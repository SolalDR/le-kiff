import * as THREE from "three";
import EffectComposer, {RenderPass} from "@johh/three-effectcomposer"
import UnrealBloomPass from "./UnrealBloomPass";

class PostProcessing {
  constructor({
    scene, 
    camera, 
    renderer
  }) {
    this.scene = scene; 
    this.camera = camera;
    this.renderer = renderer;

    this.composer = new EffectComposer( this.renderer );
    var renderScene = new RenderPass( this.scene, this.camera );
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ));
    this.bloomPass.renderToScreen = true;
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 0.3;
    this.bloomPass.radius = 0;

    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.composer.addPass( renderScene );
    this.composer.addPass( this.bloomPass );
  }

  intensity(value){
    this.bloomPass.strength = value;
  }
}

export default PostProcessing;
