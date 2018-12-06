import * as THREE from "three";
import Scale from "../Scale";
import AssetsManager from "../../../../services/assetsManager/AssetsManager";
import Earth from "./components/Earth";
import Flux from "./components/Flux";

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
    if( AssetsManager.loader.isLoaded("global") ) {
      this.initScene(AssetsManager.loader.getFiles("global"));
    }
    AssetsManager.loader.on("load:global", (event)=> this.initScene( event ))
  }

  /**
   * Init THREE.js part
   */
  initScene( assets ){
    this.earth = new Earth(assets, {
      radius: 2
    });

    for( var i=0; i<5; i++ ){
      let flux = new Flux(
        { lat: 4.757908, lon: -72.147105 },
        { lat: Math.random()*180 - 90, lon: Math.random()*360 - 180 },
        2, Math.random()*0.4
      );
      this.group.add(flux.fluxObject);
    }

    for( var i=0; i<5; i++ ){
      let flux = new Flux(
        { lat: 48.862790, lon: 2.356302 },
        { lat: Math.random()*180 - 90, lon: Math.random()*360 - 180 },
        2, Math.random()*0.4
      );
      this.group.add(flux.fluxObject);
    }

    this.group.add(this.earth.group);
  }
  
  /**
   * @override
   * Raf
   */
  loop(){
    super.loop();
    if( this.state.currentVisibility !== this.state.targetVisibility ){
      this.group.scale.x = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.y = 1 + (2 - this.state.currentVisibility*2);
      this.group.scale.z = 1 + (2 - this.state.currentVisibility*2);  
    }

    if(this.earth && this.earth.clouds) {
      this.earth.clouds.material.uniforms.u_time.value += 0.0001;
      this.earth.clouds.material.needsUpdate = true;
    }
  }
}

export default MacroScale;
