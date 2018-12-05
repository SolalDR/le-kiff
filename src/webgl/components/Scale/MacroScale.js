import * as THREE from "three";
import gui from "./../../../services/gui";
import Scale from "./Scale";
import AssetManager from "./../../../services/loaders/AssetsManager";
import cloudVert from "./../../../webgl/glsl/cloud.vert"
import cloudFrag from "./../../../webgl/glsl/cloud.frag"

class MacroScale extends Scale {
  
  /**
   * @constructor
   * @param {THREE.Scene} args.scene
   */
  constructor(args){
    super({...args, name: "macro"});
    this.state = {
      ...this.state
    }

    this.init();
  }

  /**
   * @override
   * Init scale
   */
  init(){
    super.init();
    if( AssetManager.loader.isLoaded("global") ) {
      this.initScene(AssetManager.loader.getFiles("global"));
    }
    AssetManager.loader.on("load:global", (event)=> this.initScene( event ))
  }

  /**
   * Init THREE.js part
   */
  initScene( assets ){
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshStandardMaterial({ 
        map: assets.diffuse.result, 
        normalMap: assets.normal.result,
        emissiveMap: assets.specular.result,
      })
    );

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.02, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        uniforms: {
          u_time: { value: 0, type: "f" },
          u_map: { value: assets.cloud.result, type: "t" }, 
          u_noise: { value: assets.noise.result, type: "t" }, 
          u_alpha:  {type: "f", value: 0.5}
        },
        transparent: true
      })
    );

    gui.addMaterial("earth", this.earth.material);
    gui.addMaterial("clouds", this.clouds.material);
    
    this.group.add(this.earth);
    this.group.add(this.clouds);
  }
  
  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    if( this.state.currentVisibility != this.state.targetVisibility ){
      this.group.scale.x = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.y = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.z = 1 + (2 - this.state.currentVisibility*2);  
    }

    if(this.clouds) {
      this.clouds.material.uniforms.u_time.value += 0.0001;
      this.clouds.material.needsUpdate = true;
    }
  }
}

export default MacroScale;
